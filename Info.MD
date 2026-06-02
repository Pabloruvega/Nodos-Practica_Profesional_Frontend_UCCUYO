# Contexto del proyecto — Motor de cumplimiento normativo minero
 
Sos un asistente técnico ayudando a construir un backend en Laravel. Este documento resume todo lo que se hizo hasta ahora y lo que falta. Leelo completo antes de responder cualquier cosa.
 
---
 
## Qué es este sistema
 
Un endpoint que recibe datos de una empresa proveedora y evalúa si cumple los requisitos para operar en minería. No es un chatbot. Es un motor de validación. Recibe JSON, evalúa contra reglas fijas, devuelve JSON.
 
**Stack:** Laravel 13 · PHP 8.3 · Windows  
**Ruta local:** `C:\Users\romer\Desktop\Proyecto Nodos\motor-cumplimiento`  
**Servidor:** `php artisan serve` → corre en `http://127.0.0.1:8000`  
**Pruebas:** Postman → POST a `http://127.0.0.1:8000/api/evaluar`
 
---
 
## Reglas del sistema (fuente de verdad — NO modificar)
 
Estas son las 5 reglas definidas el Día 1. La IA solo evalúa contra estas. No inventa otras.
 
```
REQ-001 · Seguro de accidentes del trabajo
  campo: seguro_accidentes
  valida: fecha_vencimiento vigente, numero_poliza presente, trabajadores_cubiertos > 0
 
REQ-002 · Registro de proveedor minero
  campo: registro_proveedor
  valida: estado_registro = "activo" o "vigente", fecha_vencimiento vigente, numero_registro presente
 
REQ-003 · Certificado de antecedentes de seguridad
  campo: certificado_seguridad
  valida: resultado = "sin_observaciones" o "aprobado", fecha_emision < 6 meses, periodo_evaluado_meses >= 12
 
REQ-004 · Acreditación de competencias del personal
  campo: acreditacion_personal
  valida: porcentaje_cobertura >= 80, fecha_ultima_actualizacion < 12 meses, organismo_certificador presente
 
REQ-005 · Plan de emergencia y gestión de riesgos
  campo: plan_emergencia
  valida: tiene_plan = true, fecha_ultima_revision < 12 meses, simulacros_realizados_anio >= 1
```
 
**Política:** lógica AND — si uno falla, el estado general es NO CUMPLE.
 
---
 
## Archivos del proyecto
 
```
motor-cumplimiento/
├── routes/
│   └── api.php                          ← define POST /api/evaluar
├── app/Http/
│   ├── Controllers/
│   │   └── EvaluacionController.php     ← detecta campos presentes/faltantes
│   └── Requests/
│       └── EvaluacionRequest.php        ← valida que "nombre" sea obligatorio
```
 
---
 
## Qué hace el endpoint hoy (Día 2 completo)
 
Recibe el JSON de la empresa, revisa si los 5 campos están presentes, y responde sin llamar a ninguna IA todavía.
 
**Entrada:**
```json
{
  "nombre": "Minera Ejemplo S.A.",
  "seguro_accidentes":     { "numero_poliza": "POL-123" },
  "registro_proveedor":    { "numero_registro": "RPM-456" },
  "certificado_seguridad": { "resultado": "aprobado" },
  "acreditacion_personal": { "porcentaje_cobertura": 85 },
  "plan_emergencia":       { "tiene_plan": true }
}
```
 
**Salida actual:**
```json
{
  "empresa": "Minera Ejemplo S.A.",
  "fecha_evaluacion": "2026-05-19",
  "mensaje": "Datos recibidos correctamente",
  "campos_recibidos": 5,
  "campos_faltantes": [],
  "listo_para_evaluar": true,
  "siguiente_paso": "Enviar a motor de evaluación IA (Día 3)"
}
```
 
Si falta `nombre` → Laravel devuelve HTTP 422 automáticamente antes de ejecutar el controlador.  
Si `listo_para_evaluar` es `false` → el Día 3 no debe llamar a la IA.
 
---
 
## Qué falta construir
 
### Día 3 — Conectar la IA (esto es lo próximo)
 
Reemplazar el `return response()->json(...)` del controlador por una llamada a la API de Claude con estos parámetros exactos:
 
```php
$configIA = [
    'model'       => 'claude-sonnet-4-6',
    'temperature' => 0.1,
    'max_tokens'  => 1500,
];
```
 
El system prompt va en inglés y sin texto conversacional:
 
```
Role: Mining compliance evaluator.
Output ONLY valid JSON. No explanations. No greetings.
Evaluate the supplier data strictly against the provided rules.
For each requirement return: id, nombre, estado (CUMPLE|NO_CUMPLE|DATO_FALTANTE), observacion.
If a field is missing or empty, return DATO_FALTANTE. Never invent data.
```
 
La IA recibe las reglas + los datos del proveedor y devuelve esto:
 
```json
{
  "empresa": "Minera Ejemplo S.A.",
  "fecha_evaluacion": "2026-05-19",
  "estado_general": "CUMPLE",
  "total_requisitos": 5,
  "requisitos_cumplidos": 5,
  "requisitos_faltantes": 0,
  "detalle": [
    {
      "id": "REQ-001",
      "nombre": "Seguro de accidentes del trabajo",
      "estado": "CUMPLE",
      "observacion": "Póliza POL-123 presente y vigente"
    }
  ]
}
```
 
---
 
### Día 4 — Pruebas
 
Tres casos obligatorios:
 
**Caso 1:** empresa con todo completo → `estado_general: CUMPLE`  
**Caso 2:** empresa con un campo faltante → `estado_general: NO_CUMPLE` + detalle del faltante  
**Caso 3:** JSON sin campo `nombre` → HTTP 422 sin llamar a la IA  
 
---
 
### Día 5 — Limpieza y entrega
 
Simplificar el system prompt, ordenar el código, documentar los tres casos de prueba con sus respuestas reales.
 
---
 
## Instrucciones para vos como asistente
 
- El stack es Laravel PHP, no Node, no Python.
- Siempre que generes código PHP, respetá el estilo de los archivos existentes.
- No agregues requisitos nuevos. Los 5 de arriba son los únicos.
- La IA del sistema evalúa con temperatura 0.1 siempre. No cambies ese parámetro.
- Si algo falla, pedí el mensaje de error completo antes de proponer solución.
- Si el usuario pregunta qué sigue, la respuesta es el Día 3: conectar la API de Claude al controlador.