<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EvaluacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255'],

            'seguro_accidentes'                                => ['nullable', 'array'],
            'seguro_accidentes.numero_poliza'                  => ['nullable', 'string'],
            'seguro_accidentes.aseguradora'                    => ['nullable', 'string'],
            'seguro_accidentes.fecha_inicio'                   => ['nullable', 'date'],
            'seguro_accidentes.fecha_vencimiento'              => ['nullable', 'date'],
            'seguro_accidentes.numero_trabajadores_cubiertos'  => ['nullable', 'integer'],

            'registro_proveedor'                               => ['nullable', 'array'],
            'registro_proveedor.numero_registro'               => ['nullable', 'string'],
            'registro_proveedor.entidad_registradora'          => ['nullable', 'string'],
            'registro_proveedor.fecha_inscripcion'             => ['nullable', 'date'],
            'registro_proveedor.estado_registro'               => ['nullable', 'string'],
            'registro_proveedor.fecha_vencimiento'             => ['nullable', 'date'],

            'certificado_seguridad'                            => ['nullable', 'array'],
            'certificado_seguridad.numero_certificado'         => ['nullable', 'string'],
            'certificado_seguridad.entidad_emisora'            => ['nullable', 'string'],
            'certificado_seguridad.resultado'                  => ['nullable', 'string'],
            'certificado_seguridad.fecha_emision'              => ['nullable', 'date'],
            'certificado_seguridad.fecha_vencimiento'          => ['nullable', 'date'],
            'certificado_seguridad.periodo_evaluado_meses'     => ['nullable', 'integer'],

            'acreditacion_personal'                            => ['nullable', 'array'],
            'acreditacion_personal.total_trabajadores'         => ['nullable', 'integer'],
            'acreditacion_personal.trabajadores_certificados'  => ['nullable', 'integer'],
            'acreditacion_personal.porcentaje_cobertura'       => ['nullable', 'numeric'],
            'acreditacion_personal.fecha_ultima_actualizacion' => ['nullable', 'date'],
            'acreditacion_personal.organismo_certificador'     => ['nullable', 'string'],

            'plan_emergencia'                                  => ['nullable', 'array'],
            'plan_emergencia.tiene_plan'                       => ['nullable', 'boolean'],
            'plan_emergencia.fecha_ultima_revision'            => ['nullable', 'date'],
            'plan_emergencia.aprobado_por'                     => ['nullable', 'string'],
            'plan_emergencia.version'                          => ['nullable', 'string'],
            'plan_emergencia.simulacros_realizados_anio'       => ['nullable', 'integer'],
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'Campo requerido: nombre',
            'nombre.string'   => 'Tipo invalido: nombre debe ser string',
        ];
    }
}
