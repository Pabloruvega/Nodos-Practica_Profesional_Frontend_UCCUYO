import { useState } from "react";
import { toast } from "sonner";
import SeccionRequisito from "@/components/evaluacion/SeccionRequisito";
import { evaluarEmpresa } from "@/services/evaluacionService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

function actualizarCampo(form, seccion, campo, valor) {
  return {
    ...form,
    [seccion]: { ...form[seccion], [campo]: valor },
  };
}

// ── Skeleton de una sección ─────────────────────────────────────
function SeccionSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-3">
      <Skeleton className="h-4 w-48" />
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Campo texto/fecha ───────────────────────────────────────────
function Campo({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground uppercase tracking-wider">
        {label}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-background border-border text-foreground focus:border-ring"
      />
    </div>
  );
}

// ── Campo select ────────────────────────────────────────────────
function CampoSelect({ label, value, onChange, opciones }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground uppercase tracking-wider">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-background border-border text-foreground">
          <SelectValue placeholder="— seleccionar —" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {opciones.map((op) => (
            <SelectItem key={op.value} value={op.value} className="text-foreground">
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// ── Componente principal ────────────────────────────────────────
export default function FormularioEvaluacion({ onResultado }) {
  const [form, setForm] = useState(FORM_INICIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (seccion, campo) => (valor) => {
    setForm((prev) => actualizarCampo(prev, seccion, campo, valor));
  };

  const handleSubmit = async () => {
    if (!form.nombre.trim()) {
      setError("El nombre de la empresa es obligatorio.");
      toast.error("El nombre de la empresa es obligatorio.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resultado = await evaluarEmpresa(form);
      toast.success(`Evaluación completada — ${resultado.estado_general === "CUMPLE" ? "Cumple" : "No Cumple"}`);
      onResultado(resultado);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Skeleton mientras carga ─────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="space-y-1">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SeccionSkeleton />
          <SeccionSkeleton />
          <SeccionSkeleton />
          <SeccionSkeleton />
          <div className="col-span-2 flex justify-center">
            <div className="w-[calc(50%-8px)]">
              <SeccionSkeleton />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-40" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Nombre empresa */}
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">
          Nombre de la empresa *
        </Label>
        <Input
          type="text"
          value={form.nombre}
          onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
          placeholder="Ej: Minera Andina S.A."
          className="bg-background border-border text-foreground focus:border-ring text-base"
        />
      </div>

      {/* Secciones en grilla 2 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* REQ-001 */}
        <SeccionRequisito emoji="" titulo="REQ-001 · Seguro de Accidentes del Trabajo">
          <Campo label="N° Póliza"              value={form.seguro_accidentes.numero_poliza}                  onChange={set("seguro_accidentes", "numero_poliza")} />
          <Campo label="Aseguradora"            value={form.seguro_accidentes.aseguradora}                    onChange={set("seguro_accidentes", "aseguradora")} />
          <Campo label="Fecha Inicio"           value={form.seguro_accidentes.fecha_inicio}                   onChange={set("seguro_accidentes", "fecha_inicio")} type="date" />
          <Campo label="Fecha Vencimiento"      value={form.seguro_accidentes.fecha_vencimiento}              onChange={set("seguro_accidentes", "fecha_vencimiento")} type="date" />
          <Campo label="Trabajadores Cubiertos" value={form.seguro_accidentes.numero_trabajadores_cubiertos}  onChange={set("seguro_accidentes", "numero_trabajadores_cubiertos")} type="number" />
        </SeccionRequisito>

        {/* REQ-002 */}
        <SeccionRequisito emoji="" titulo="REQ-002 · Registro de Proveedor Minero">
          <Campo label="N° Registro"          value={form.registro_proveedor.numero_registro}       onChange={set("registro_proveedor", "numero_registro")} />
          <Campo label="Entidad Registradora" value={form.registro_proveedor.entidad_registradora}  onChange={set("registro_proveedor", "entidad_registradora")} />
          <Campo label="Fecha Inscripción"    value={form.registro_proveedor.fecha_inscripcion}     onChange={set("registro_proveedor", "fecha_inscripcion")} type="date" />
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
        <SeccionRequisito emoji="" titulo="REQ-003 · Certificado de Antecedentes de Seguridad">
          <Campo label="N° Certificado"  value={form.certificado_seguridad.numero_certificado}    onChange={set("certificado_seguridad", "numero_certificado")} />
          <Campo label="Entidad Emisora" value={form.certificado_seguridad.entidad_emisora}        onChange={set("certificado_seguridad", "entidad_emisora")} />
          <CampoSelect
            label="Resultado"
            value={form.certificado_seguridad.resultado}
            onChange={set("certificado_seguridad", "resultado")}
            opciones={[
              { value: "aprobado",          label: "Aprobado" },
              { value: "sin_observaciones", label: "Sin Observaciones" },
              { value: "con_observaciones", label: "Con Observaciones" },
            ]}
          />
          <Campo label="Fecha Emisión"           value={form.certificado_seguridad.fecha_emision}           onChange={set("certificado_seguridad", "fecha_emision")} type="date" />
          <Campo label="Fecha Vencimiento"       value={form.certificado_seguridad.fecha_vencimiento}       onChange={set("certificado_seguridad", "fecha_vencimiento")} type="date" />
          <Campo label="Período Evaluado (meses)" value={form.certificado_seguridad.periodo_evaluado_meses} onChange={set("certificado_seguridad", "periodo_evaluado_meses")} type="number" />
        </SeccionRequisito>

        {/* REQ-004 */}
        <SeccionRequisito emoji="" titulo="REQ-004 · Acreditación de Competencias del Personal">
          <Campo label="Total Trabajadores"         value={form.acreditacion_personal.total_trabajadores}         onChange={set("acreditacion_personal", "total_trabajadores")} type="number" />
          <Campo label="Trabajadores Certificados"  value={form.acreditacion_personal.trabajadores_certificados}  onChange={set("acreditacion_personal", "trabajadores_certificados")} type="number" />
          <Campo label="% Cobertura"                value={form.acreditacion_personal.porcentaje_cobertura}       onChange={set("acreditacion_personal", "porcentaje_cobertura")} type="number" />
          <Campo label="Fecha Última Actualización" value={form.acreditacion_personal.fecha_ultima_actualizacion} onChange={set("acreditacion_personal", "fecha_ultima_actualizacion")} type="date" />
          <Campo label="Organismo Certificador"     value={form.acreditacion_personal.organismo_certificador}     onChange={set("acreditacion_personal", "organismo_certificador")} />
        </SeccionRequisito>

        {/* REQ-005 — centrada */}
        <div className="col-span-2 flex justify-center">
          <div className="w-[calc(50%-8px)]">
            <SeccionRequisito emoji="" titulo="REQ-005 · Plan de Emergencia y Gestión de Riesgos">
              <CampoSelect
                label="Tiene Plan"
                value={form.plan_emergencia.tiene_plan}
                onChange={set("plan_emergencia", "tiene_plan")}
                opciones={[
                  { value: "true",  label: "Sí" },
                  { value: "false", label: "No" },
                ]}
              />
              <Campo label="Fecha Última Revisión"      value={form.plan_emergencia.fecha_ultima_revision}       onChange={set("plan_emergencia", "fecha_ultima_revision")} type="date" />
              <Campo label="Aprobado Por"               value={form.plan_emergencia.aprobado_por}                onChange={set("plan_emergencia", "aprobado_por")} />
              <Campo label="Versión"                    value={form.plan_emergencia.version}                     onChange={set("plan_emergencia", "version")} />
              <Campo label="Simulacros Realizados (año)" value={form.plan_emergencia.simulacros_realizados_anio} onChange={set("plan_emergencia", "simulacros_realizados_anio")} type="number" />
            </SeccionRequisito>
          </div>
        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm">
           {error}
        </div>
      )}

      {/* Acciones */}
      <div className="flex justify-between items-center pt-2">
        <Button
          variant="outline"
          onClick={() => {
            setForm(FORM_EJEMPLO);
            toast.info("Ejemplo cargado");
          }}
          className="border-border text-muted-foreground hover:text-foreground"
        >
           Cargar ejemplo
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold tracking-wide"
        >
          Evaluar Empresa →
        </Button>
      </div>
    </div>
  );
}