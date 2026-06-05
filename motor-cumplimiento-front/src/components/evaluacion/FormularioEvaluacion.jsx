import { useState } from "react";
import SeccionRequisito from "@/components/evaluacion/SeccionRequisito";
import { evaluarEmpresa } from "@/services/evaluacionService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Estado inicial vacío del formulario
const FORM_INICIAL = {
  nombre: "",
  seguro_accidentes: {
    numero_poliza: "",
    aseguradora: "",
    fecha_inicio: "",
    fecha_vencimiento: "",
    numero_trabajadores_cubiertos: "",
  },
  registro_proveedor: {
    numero_registro: "",
    entidad_registradora: "",
    fecha_inscripcion: "",
    estado_registro: "",
    fecha_vencimiento: "",
  },
  certificado_seguridad: {
    numero_certificado: "",
    entidad_emisora: "",
    resultado: "",
    fecha_emision: "",
    fecha_vencimiento: "",
    periodo_evaluado_meses: "",
  },
  acreditacion_personal: {
    total_trabajadores: "",
    trabajadores_certificados: "",
    porcentaje_cobertura: "",
    fecha_ultima_actualizacion: "",
    organismo_certificador: "",
  },
  plan_emergencia: {
    tiene_plan: "",
    fecha_ultima_revision: "",
    aprobado_por: "",
    version: "",
    simulacros_realizados_anio: "",
  },
};

// Datos de ejemplo para pruebas rápidas
const FORM_EJEMPLO = {
  nombre: "Minera Andina S.A.",
  seguro_accidentes: {
    numero_poliza: "POL-2024-789",
    aseguradora: "Seguros del Norte",
    fecha_inicio: "2024-01-01",
    fecha_vencimiento: "2026-12-31",
    numero_trabajadores_cubiertos: "45",
  },
  registro_proveedor: {
    numero_registro: "RPM-2023-456",
    entidad_registradora: "SERNAGEOMIN",
    fecha_inscripcion: "2023-03-15",
    estado_registro: "activo",
    fecha_vencimiento: "2026-03-15",
  },
  certificado_seguridad: {
    numero_certificado: "CERT-SEG-2025-112",
    entidad_emisora: "Instituto de Seguridad Minera",
    resultado: "aprobado",
    fecha_emision: "2025-11-01",
    fecha_vencimiento: "2026-11-01",
    periodo_evaluado_meses: "14",
  },
  acreditacion_personal: {
    total_trabajadores: "45",
    trabajadores_certificados: "40",
    porcentaje_cobertura: "88.9",
    fecha_ultima_actualizacion: "2024-06-15",
    organismo_certificador: "ACHS",
  },
  plan_emergencia: {
    tiene_plan: "true",
    fecha_ultima_revision: "2025-09-20",
    aprobado_por: "Gerencia de Seguridad",
    version: "v3.2",
    simulacros_realizados_anio: "3",
  },
};

/**
 * Actualiza un campo anidado dentro del estado del formulario.
 * Ejemplo: setField("seguro_accidentes", "numero_poliza", "POL-123")
 */
function actualizarCampo(form, seccion, campo, valor) {
  return {
    ...form,
    [seccion]: {
      ...form[seccion],
      [campo]: valor,
    },
  };
}

// ── Subcomponentes internos ──────────────────────────────────────

/**
 * Campo de texto o fecha reutilizable dentro de una sección.
 */
function Campo({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-zinc-500 uppercase tracking-wider">
        {label}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:border-zinc-400 dark:focus:border-zinc-500"
      />
    </div>
  );
}

/**
 * Campo de selección reutilizable dentro de una sección.
 */
function CampoSelect({ label, value, onChange, opciones }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-zinc-500 uppercase tracking-wider">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
          <SelectValue placeholder="— seleccionar —" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          {opciones.map((op) => (
            <SelectItem key={op.value} value={op.value} className="text-zinc-900 dark:text-zinc-100">
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────

/**
 * Formulario completo de evaluación de cumplimiento normativo.
 *
 * Props:
 *   @param {function} onResultado - callback que recibe el resultado del backend
 */
export default function FormularioEvaluacion({ onResultado }) {
  const [form, setForm] = useState(FORM_INICIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helpers para actualizar cada sección
  const set = (seccion, campo) => (valor) => {
    setForm((prev) => actualizarCampo(prev, seccion, campo, valor));
  };

  const handleSubmit = async () => {
    if (!form.nombre.trim()) {
      setError("El nombre de la empresa es obligatorio.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resultado = await evaluarEmpresa(form);
      onResultado(resultado);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">

      {/* Nombre empresa */}
      <div className="space-y-1">
        <Label className="text-xs text-zinc-500 uppercase tracking-wider">
          Nombre de la empresa *
        </Label>
        <Input
          type="text"
          value={form.nombre}
          onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
          placeholder="Ej: Minera Andina S.A."
          className="bg-zinc-900 border-zinc-800 text-zinc-100 text-base focus:border-zinc-500"
        />
      </div>

      {/* Secciones REQ en grilla 2 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* REQ-001 */}
        <SeccionRequisito emoji="🛡️" titulo="REQ-001 · Seguro de Accidentes del Trabajo">
          <Campo label="N° Póliza"        value={form.seguro_accidentes.numero_poliza}                 onChange={set("seguro_accidentes", "numero_poliza")} />
          <Campo label="Aseguradora"      value={form.seguro_accidentes.aseguradora}                   onChange={set("seguro_accidentes", "aseguradora")} />
          <Campo label="Fecha Inicio"     value={form.seguro_accidentes.fecha_inicio}                  onChange={set("seguro_accidentes", "fecha_inicio")} type="date" />
          <Campo label="Fecha Vencimiento" value={form.seguro_accidentes.fecha_vencimiento}            onChange={set("seguro_accidentes", "fecha_vencimiento")} type="date" />
          <Campo label="Trabajadores Cubiertos" value={form.seguro_accidentes.numero_trabajadores_cubiertos} onChange={set("seguro_accidentes", "numero_trabajadores_cubiertos")} type="number" />
        </SeccionRequisito>

        {/* REQ-002 */}
        <SeccionRequisito emoji="📋" titulo="REQ-002 · Registro de Proveedor Minero">
          <Campo label="N° Registro"          value={form.registro_proveedor.numero_registro}      onChange={set("registro_proveedor", "numero_registro")} />
          <Campo label="Entidad Registradora" value={form.registro_proveedor.entidad_registradora} onChange={set("registro_proveedor", "entidad_registradora")} />
          <Campo label="Fecha Inscripción"    value={form.registro_proveedor.fecha_inscripcion}    onChange={set("registro_proveedor", "fecha_inscripcion")} type="date" />
          <CampoSelect
            label="Estado Registro"
            value={form.registro_proveedor.estado_registro}
            onChange={set("registro_proveedor", "estado_registro")}
            opciones={[
              { value: "activo",   label: "Activo" },
              { value: "vigente",  label: "Vigente" },
              { value: "inactivo", label: "Inactivo" },
            ]}
          />
          <Campo label="Fecha Vencimiento" value={form.registro_proveedor.fecha_vencimiento} onChange={set("registro_proveedor", "fecha_vencimiento")} type="date" />
        </SeccionRequisito>

        {/* REQ-003 */}
        <SeccionRequisito emoji="✅" titulo="REQ-003 · Certificado de Antecedentes de Seguridad">
          <Campo label="N° Certificado"   value={form.certificado_seguridad.numero_certificado}     onChange={set("certificado_seguridad", "numero_certificado")} />
          <Campo label="Entidad Emisora"  value={form.certificado_seguridad.entidad_emisora}         onChange={set("certificado_seguridad", "entidad_emisora")} />
          <CampoSelect
            label="Resultado"
            value={form.certificado_seguridad.resultado}
            onChange={set("certificado_seguridad", "resultado")}
            opciones={[
              { value: "aprobado",           label: "Aprobado" },
              { value: "sin_observaciones",  label: "Sin Observaciones" },
              { value: "con_observaciones",  label: "Con Observaciones" },
            ]}
          />
          <Campo label="Fecha Emisión"      value={form.certificado_seguridad.fecha_emision}      onChange={set("certificado_seguridad", "fecha_emision")} type="date" />
          <Campo label="Fecha Vencimiento"  value={form.certificado_seguridad.fecha_vencimiento}  onChange={set("certificado_seguridad", "fecha_vencimiento")} type="date" />
          <Campo label="Período Evaluado (meses)" value={form.certificado_seguridad.periodo_evaluado_meses} onChange={set("certificado_seguridad", "periodo_evaluado_meses")} type="number" />
        </SeccionRequisito>

        {/* REQ-004 */}
        <SeccionRequisito emoji="👷" titulo="REQ-004 · Acreditación de Competencias del Personal">
          <Campo label="Total Trabajadores"        value={form.acreditacion_personal.total_trabajadores}         onChange={set("acreditacion_personal", "total_trabajadores")} type="number" />
          <Campo label="Trabajadores Certificados" value={form.acreditacion_personal.trabajadores_certificados}  onChange={set("acreditacion_personal", "trabajadores_certificados")} type="number" />
          <Campo label="% Cobertura"               value={form.acreditacion_personal.porcentaje_cobertura}       onChange={set("acreditacion_personal", "porcentaje_cobertura")} type="number" />
          <Campo label="Fecha Última Actualización" value={form.acreditacion_personal.fecha_ultima_actualizacion} onChange={set("acreditacion_personal", "fecha_ultima_actualizacion")} type="date" />
          <Campo label="Organismo Certificador"    value={form.acreditacion_personal.organismo_certificador}     onChange={set("acreditacion_personal", "organismo_certificador")} />
        </SeccionRequisito>

        {/* REQ-005 — centrada en su propia fila */}
        <div className="col-span-2 flex justify-center">
          <div className="w-[calc(50%-8px)]">
            <SeccionRequisito emoji="🚨" titulo="REQ-005 · Plan de Emergencia y Gestión de Riesgos">
              <CampoSelect
                label="Tiene Plan"
                value={form.plan_emergencia.tiene_plan}
                onChange={set("plan_emergencia", "tiene_plan")}
                opciones={[
                  { value: "true",  label: "Sí" },
                  { value: "false", label: "No" },
                ]}
              />
              <Campo label="Fecha Última Revisión"     value={form.plan_emergencia.fecha_ultima_revision}      onChange={set("plan_emergencia", "fecha_ultima_revision")} type="date" />
              <Campo label="Aprobado Por"              value={form.plan_emergencia.aprobado_por}               onChange={set("plan_emergencia", "aprobado_por")} />
              <Campo label="Versión"                   value={form.plan_emergencia.version}                    onChange={set("plan_emergencia", "version")} />
              <Campo label="Simulacros Realizados (año)" value={form.plan_emergencia.simulacros_realizados_anio} onChange={set("plan_emergencia", "simulacros_realizados_anio")} type="number" />
            </SeccionRequisito>
          </div>
        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-950 border border-red-800 text-red-400 rounded-lg px-4 py-3 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Acciones */}
      <div className="flex justify-between items-center pt-2">
        <Button
          variant="outline"
          onClick={() => setForm(FORM_EJEMPLO)}
          className="border-zinc-700 text-zinc-400 hover:text-zinc-100"
        >
          ⚡ Cargar ejemplo
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold tracking-wide"
        >
          {loading ? "⏳ Evaluando..." : "Evaluar Empresa →"}
        </Button>
      </div>
    </div>
  );
}