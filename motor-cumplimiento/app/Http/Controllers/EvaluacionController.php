<?php

namespace App\Http\Controllers;

use App\Http\Requests\EvaluacionRequest;
use Illuminate\Http\JsonResponse;
use GuzzleHttp\Client;
use Carbon\Carbon;

class EvaluacionController extends Controller
{
    private const DIAS_POR_VENCER = 30;

    private array $nombresRequisitos = [
        'REQ-001' => 'Seguro de accidentes del trabajo',
        'REQ-002' => 'Registro de proveedor minero',
        'REQ-003' => 'Certificado de antecedentes de seguridad',
        'REQ-004' => 'Acreditacion de competencias del personal',
        'REQ-005' => 'Plan de emergencia y gestion de riesgos',
    ];

    public function evaluar(EvaluacionRequest $request): JsonResponse
    {
        set_time_limit(180);
        $datos = $request->validated();

        $validaciones = $this->validarTodo($datos);
        $observaciones = $this->generarObservaciones($datos, $validaciones);

        return response()->json(
            $this->ensamblarRespuesta($datos['nombre'], $validaciones, $observaciones),
            200,
            ['Content-Type' => 'application/json; charset=UTF-8'],
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );
    }

    private function validarTodo(array $datos): array
    {
        return [
            'REQ-001' => $this->validarReq001($datos['seguro_accidentes']     ?? null),
            'REQ-002' => $this->validarReq002($datos['registro_proveedor']    ?? null),
            'REQ-003' => $this->validarReq003($datos['certificado_seguridad'] ?? null),
            'REQ-004' => $this->validarReq004($datos['acreditacion_personal'] ?? null),
            'REQ-005' => $this->validarReq005($datos['plan_emergencia']       ?? null),
        ];
    }

    private function validarReq001(?array $seccion): array
    {
        if (empty($seccion)) {
            return $this->resultadoFaltante('Seccion seguro_accidentes no enviada');
        }

        $faltantes = $this->detectarFaltantes($seccion, ['numero_poliza', 'fecha_vencimiento', 'numero_trabajadores_cubiertos']);
        if (!empty($faltantes)) {
            return $this->resultadoFaltante('Faltan campos: ' . implode(', ', $faltantes));
        }

        $dias    = $this->diasHastaFecha($seccion['fecha_vencimiento']);
        $fallas  = [];

        if ($dias === null) {
            $fallas[] = "fecha_vencimiento con formato invalido ({$seccion['fecha_vencimiento']})";
        } elseif ($dias < 0) {
            $fallas[] = "poliza vencida hace " . abs($dias) . " dias (vencio el {$seccion['fecha_vencimiento']})";
        }

        if ((int)$seccion['numero_trabajadores_cubiertos'] <= 0) {
            $fallas[] = "trabajadores cubiertos {$seccion['numero_trabajadores_cubiertos']}, debe ser mayor a 0";
        }

        return $this->resultadoFinal($dias, $fallas, [
            'numero_poliza'                  => $seccion['numero_poliza'],
            'fecha_vencimiento'              => $seccion['fecha_vencimiento'],
            'numero_trabajadores_cubiertos'  => $seccion['numero_trabajadores_cubiertos'],
        ]);
    }

    private function validarReq002(?array $seccion): array
    {
        if (empty($seccion)) {
            return $this->resultadoFaltante('Seccion registro_proveedor no enviada');
        }

        $faltantes = $this->detectarFaltantes($seccion, ['numero_registro', 'estado_registro', 'fecha_vencimiento']);
        if (!empty($faltantes)) {
            return $this->resultadoFaltante('Faltan campos: ' . implode(', ', $faltantes));
        }

        $dias   = $this->diasHastaFecha($seccion['fecha_vencimiento']);
        $fallas = [];

        $estadoValido = ['activo', 'vigente'];
        if (!in_array(strtolower($seccion['estado_registro']), $estadoValido, true)) {
            $fallas[] = "estado_registro '{$seccion['estado_registro']}' no es activo ni vigente";
        }

        if ($dias === null) {
            $fallas[] = "fecha_vencimiento con formato invalido ({$seccion['fecha_vencimiento']})";
        } elseif ($dias < 0) {
            $fallas[] = "registro vencido hace " . abs($dias) . " dias (vencio el {$seccion['fecha_vencimiento']})";
        }

        return $this->resultadoFinal($dias, $fallas, [
            'numero_registro'   => $seccion['numero_registro'],
            'estado_registro'   => $seccion['estado_registro'],
            'fecha_vencimiento' => $seccion['fecha_vencimiento'],
        ]);
    }

    private function validarReq003(?array $seccion): array
    {
        if (empty($seccion)) {
            return $this->resultadoFaltante('Seccion certificado_seguridad no enviada');
        }

        $faltantes = $this->detectarFaltantes($seccion, ['resultado', 'fecha_emision', 'periodo_evaluado_meses']);
        if (!empty($faltantes)) {
            return $this->resultadoFaltante('Faltan campos: ' . implode(', ', $faltantes));
        }

        $diasVencimiento = isset($seccion['fecha_vencimiento']) ? $this->diasHastaFecha($seccion['fecha_vencimiento']) : null;
        $antiguedad      = $this->diasDesdeFecha($seccion['fecha_emision']);
        $fallas          = [];

        $resultadosValidos = ['sin_observaciones', 'aprobado'];
        if (!in_array(strtolower($seccion['resultado']), $resultadosValidos, true)) {
            $fallas[] = "resultado '{$seccion['resultado']}' no es sin_observaciones ni aprobado";
        }

        if ($antiguedad === null) {
            $fallas[] = "fecha_emision con formato invalido ({$seccion['fecha_emision']})";
        } elseif ($antiguedad > 180) {
            $fallas[] = "certificado emitido hace {$antiguedad} dias, supera los 6 meses permitidos";
        }

        if ((int)$seccion['periodo_evaluado_meses'] < 12) {
            $fallas[] = "periodo_evaluado_meses {$seccion['periodo_evaluado_meses']}, debe ser mayor o igual a 12";
        }

        return $this->resultadoFinal($diasVencimiento, $fallas, [
            'resultado'              => $seccion['resultado'],
            'fecha_emision'          => $seccion['fecha_emision'],
            'periodo_evaluado_meses' => $seccion['periodo_evaluado_meses'],
            'fecha_vencimiento'      => $seccion['fecha_vencimiento'] ?? null,
        ]);
    }

    private function validarReq004(?array $seccion): array
    {
        if (empty($seccion)) {
            return $this->resultadoFaltante('Seccion acreditacion_personal no enviada');
        }

        $faltantes = $this->detectarFaltantes($seccion, ['porcentaje_cobertura', 'fecha_ultima_actualizacion', 'organismo_certificador']);
        if (!empty($faltantes)) {
            return $this->resultadoFaltante('Faltan campos: ' . implode(', ', $faltantes));
        }

        $antiguedad = $this->diasDesdeFecha($seccion['fecha_ultima_actualizacion']);
        $fallas     = [];

        $cobertura = (float)$seccion['porcentaje_cobertura'];
        if ($cobertura < 80) {
            $fallas[] = "cobertura {$cobertura}% es menor al mínimo de 80% requerido";
        }

        if ($antiguedad === null) {
            $fallas[] = "fecha_ultima_actualizacion con formato invalido ({$seccion['fecha_ultima_actualizacion']})";
        } elseif ($antiguedad > 1095) {
            $anios = round($antiguedad / 365, 1);
            $fallas[] = "ultima actualizacion hace {$anios} anos (supera los 3 anos permitidos). El personal debe volver a realizar el curso de acreditacion";
        }

        return $this->resultadoFinal(null, $fallas, [
            'porcentaje_cobertura'       => $seccion['porcentaje_cobertura'],
            'fecha_ultima_actualizacion' => $seccion['fecha_ultima_actualizacion'],
            'organismo_certificador'     => $seccion['organismo_certificador'],
            'antiguedad_anios'           => $antiguedad !== null ? round($antiguedad / 365, 1) : null,
        ]);
    }

    private function validarReq005(?array $seccion): array
    {
        if (empty($seccion)) {
            return $this->resultadoFaltante('Seccion plan_emergencia no enviada');
        }

        $faltantes = $this->detectarFaltantes($seccion, ['tiene_plan', 'fecha_ultima_revision', 'simulacros_realizados_anio']);
        if (!empty($faltantes)) {
            return $this->resultadoFaltante('Faltan campos: ' . implode(', ', $faltantes));
        }

        $antiguedad = $this->diasDesdeFecha($seccion['fecha_ultima_revision']);
        $fallas     = [];

        if ($seccion['tiene_plan'] !== true) {
            $fallas[] = "tiene_plan no es true";
        }

        if ($antiguedad === null) {
            $fallas[] = "fecha_ultima_revision con formato invalido ({$seccion['fecha_ultima_revision']})";
        } elseif ($antiguedad > 365) {
            $fallas[] = "ultima revision hace {$antiguedad} dias, supera los 12 meses permitidos";
        }

        if ((int)$seccion['simulacros_realizados_anio'] < 1) {
            $fallas[] = "simulacros realizados {$seccion['simulacros_realizados_anio']}, debe ser al menos 1";
        }

        return $this->resultadoFinal(null, $fallas, [
            'tiene_plan'                 => $seccion['tiene_plan'],
            'fecha_ultima_revision'      => $seccion['fecha_ultima_revision'],
            'simulacros_realizados_anio' => $seccion['simulacros_realizados_anio'],
        ]);
    }

    private function detectarFaltantes(array $seccion, array $requeridos): array
    {
        $faltantes = [];
        foreach ($requeridos as $campo) {
            $valor = $seccion[$campo] ?? null;
            if ($valor === null || $valor === '' || (is_string($valor) && trim($valor) === '')) {
                $faltantes[] = $campo;
            }
        }
        return $faltantes;
    }

    private function resultadoFaltante(string $razon): array
    {
        return [
            'estado'         => 'DATO_FALTANTE',
            'dias_restantes' => null,
            'fallas'         => [$razon],
            'datos'          => [],
        ];
    }

    private function resultadoFinal(?int $diasVencimiento, array $fallas, array $datos): array
    {
        if (!empty($fallas)) {
            return [
                'estado'         => 'NO_CUMPLE',
                'dias_restantes' => $diasVencimiento,
                'fallas'         => $fallas,
                'datos'          => $datos,
            ];
        }

        if ($diasVencimiento !== null && $diasVencimiento <= self::DIAS_POR_VENCER) {
            return [
                'estado'         => 'POR_VENCER',
                'dias_restantes' => $diasVencimiento,
                'fallas'         => [],
                'datos'          => $datos,
            ];
        }

        return [
            'estado'         => 'CUMPLE',
            'dias_restantes' => $diasVencimiento,
            'fallas'         => [],
            'datos'          => $datos,
        ];
    }

    private function diasHastaFecha(string $fecha): ?int
    {
        try {
            return (int) now()->startOfDay()->diffInDays(Carbon::parse($fecha)->startOfDay(), false);
        } catch (\Exception) {
            return null;
        }
    }

    private function diasDesdeFecha(string $fecha): ?int
    {
        try {
            return (int) Carbon::parse($fecha)->startOfDay()->diffInDays(now()->startOfDay(), false);
        } catch (\Exception) {
            return null;
        }
    }

    private function generarObservaciones(array $datos, array $validaciones): array
    {
        $systemPrompt = $this->promptObservaciones();
        $userMessage  = $this->mensajeParaObservaciones($datos['nombre'], $validaciones);

        $intentos   = 3;
        $esperaBase = 5;

        for ($i = 0; $i < $intentos; $i++) {
            try {
                $client   = new Client();
                $response = $client->post('https://api.groq.com/openai/v1/chat/completions', [
                    'headers' => [
                        'Authorization' => 'Bearer ' . env('GROQ_API_KEY'),
                        'Content-Type'  => 'application/json',
                        'Accept'        => 'application/json',
                    ],
                    'json' => [
                        'model'           => env('GROQ_MODEL', 'llama3-8b-8192'),
                        'messages'        => [
                            ['role' => 'system', 'content' => $systemPrompt],
                            ['role' => 'user',   'content' => $userMessage],
                        ],
                        'temperature'     => 0.2,
                        'max_tokens'      => 800,
                        'response_format' => ['type' => 'json_object'],
                    ],
                    'timeout' => 30,
                ]);

                $body    = json_decode($response->getBody()->getContents(), true);
                $textoIA = trim($body['choices'][0]['message']['content'] ?? '');

                if ($textoIA === '') {
                    return [];
                }

                $textoIA   = trim(preg_replace('/^```(?:json)?\s*|\s*```$/i', '', $textoIA));
                $resultado = json_decode($textoIA, true);

                if (json_last_error() !== JSON_ERROR_NONE || !isset($resultado['observaciones'])) {
                    \Log::warning('Observaciones Groq inválidas, usando fallback', ['raw' => $textoIA]);
                    return [];
                }

                return $resultado['observaciones'];

            } catch (\GuzzleHttp\Exception\ServerException|\GuzzleHttp\Exception\ClientException $e) {
                $codigo = $e->getResponse()->getStatusCode();

                if (in_array($codigo, [429, 503]) && $i < $intentos - 1) {
                    $espera = $esperaBase * (2 ** $i);
                    \Log::warning("Groq {$codigo} — reintentando en {$espera}s (intento " . ($i + 1) . "/{$intentos})");
                    sleep($espera);
                    continue;
                }

                \Log::warning('Falló la generación de observaciones Groq, usando fallback', ['codigo' => $codigo]);
                return [];

            } catch (\Exception $e) {
                \Log::warning('Falló la generación de observaciones Groq, usando fallback', ['error' => $e->getMessage()]);
                return [];
            }
        }

        return [];
    }

    private function promptObservaciones(): string
    {
        return <<<PROMPT
Role: Compliance observation writer.
Task: Given the validation results provided by the system, write ONE short observation per requirement.

CRITICAL RULES:
- Use ONLY the data and validation facts provided in the input. NEVER invent values.
- Each observation: 8 to 20 words, in spanish, written in past or present tense.
- Do NOT add diagnoses, recommendations, or estado labels.
- Always include the specific numbers, dates, or names from the input.
- IMPORTANT: write spanish WITHOUT ACCENTS or tildes (no acute accents, no umlauts). Use plain ASCII letters only. Examples: "dias" not "días", "acreditacion" not "acreditación", "vencio" not "venció", "ultima" not "última", "anos" not "años".

For each estado, follow this pattern:
- CUMPLE        → Mention what passed (specific values from "datos").
- POR_VENCER    → Mention which value is expiring and the date.
- NO_CUMPLE     → Repeat the reason from "fallas" using natural spanish.
- DATO_FALTANTE → Repeat the reason from "fallas".

Output schema (return EXACTLY this):
{
  "observaciones": {
    "REQ-001": "<text>",
    "REQ-002": "<text>",
    "REQ-003": "<text>",
    "REQ-004": "<text>",
    "REQ-005": "<text>"
  }
}
PROMPT;
    }

    private function mensajeParaObservaciones(string $empresa, array $validaciones): string
    {
        return "Empresa: {$empresa}\n\nRESULTADOS DE VALIDACION (verdad absoluta — basate solo en esto):\n"
            . json_encode($validaciones, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    private function ensamblarRespuesta(string $empresa, array $validaciones, array $observaciones): array
    {
        $detalle     = [];
        $cumplidos   = 0;
        $faltantes   = 0;
        $incumplidos = 0;

        foreach ($this->nombresRequisitos as $id => $nombre) {
            $val         = $validaciones[$id];
            $estado      = $val['estado'];
            $dias        = $val['dias_restantes'];
            $observacion = trim($observaciones[$id] ?? '');

            if ($observacion === '') {
                $observacion = $this->observacionFallback($val, $nombre);
            }

            $observacion = $this->agregarPrefijoFecha($observacion, $dias);

            $detalle[] = [
                'id'             => $id,
                'nombre'         => $this->sinAcentos($nombre),
                'estado'         => $estado,
                'observacion'    => $this->sinAcentos($observacion),
                'dias_restantes' => $dias,
            ];

            match ($estado) {
                'CUMPLE', 'POR_VENCER' => $cumplidos++,
                'DATO_FALTANTE'        => $faltantes++,
                default                => $incumplidos++,
            };
        }

        return [
            'empresa'              => $this->sinAcentos($empresa),
            'fecha_evaluacion'     => now()->toDateString(),
            'estado_general'       => ($cumplidos === 5) ? 'CUMPLE' : 'NO_CUMPLE',
            'requisitos_cumplidos' => $cumplidos,
            'requisitos_faltantes' => $faltantes,
            'requisitos_no_cumple' => $incumplidos,
            'detalle'              => $detalle,
        ];
    }

    private function sinAcentos(string $texto): string
    {
        return strtr($texto, [
            'á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u',
            'Á' => 'A', 'É' => 'E', 'Í' => 'I', 'Ó' => 'O', 'Ú' => 'U',
            'ñ' => 'n', 'Ñ' => 'N',
            'ü' => 'u', 'Ü' => 'U',
        ]);
    }

    private function observacionFallback(array $validacion, string $nombre): string
    {
        return match ($validacion['estado']) {
            'CUMPLE'        => "{$nombre}: cumple todos los criterios. Datos: " . $this->resumirDatos($validacion['datos']),
            'POR_VENCER'    => "{$nombre}: vigente pero proximo a vencer",
            'NO_CUMPLE'     => "{$nombre}: " . implode('; ', $validacion['fallas']),
            'DATO_FALTANTE' => "{$nombre}: " . implode('; ', $validacion['fallas']),
            default         => "{$nombre}: estado desconocido",
        };
    }

    private function resumirDatos(array $datos): string
    {
        $partes = [];
        foreach ($datos as $clave => $valor) {
            if ($valor === null) continue;
            $partes[] = "{$clave}={$valor}";
        }
        return implode(', ', $partes);
    }

    private function agregarPrefijoFecha(string $observacion, ?int $dias): string
    {
        if ($dias === null) {
            return $observacion;
        }

        $prefijo = match (true) {
            $dias < 0   => "Vencio hace " . abs($dias) . " dias.",
            $dias <= self::DIAS_POR_VENCER => "Vence en {$dias} dias.",
            default     => null,
        };

        if ($prefijo === null) {
            return $observacion;
        }

        if (stripos($observacion, 'vencio') !== false || stripos($observacion, 'vence en') !== false) {
            return $observacion;
        }

        return $prefijo . ' ' . $observacion;
    }
}
