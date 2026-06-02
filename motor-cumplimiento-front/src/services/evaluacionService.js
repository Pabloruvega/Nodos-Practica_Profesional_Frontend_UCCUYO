import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
});

/**
 * Limpia el payload antes de enviarlo:
 * - Omite campos vacíos
 * - Convierte tipos correctamente
 */
function limpiarPayload(form) {
  const CAMPOS_INT = [
    "numero_trabajadores_cubiertos",
    "periodo_evaluado_meses",
    "total_trabajadores",
    "trabajadores_certificados",
    "simulacros_realizados_anio",
  ];
  const CAMPOS_FLOAT = ["porcentaje_cobertura"];

  const out = { nombre: form.nombre };

  const secciones = [
    "seguro_accidentes",
    "registro_proveedor",
    "certificado_seguridad",
    "acreditacion_personal",
    "plan_emergencia",
  ];

  for (const seccion of secciones) {
    const raw = form[seccion];
    if (!raw) continue;

    const limpio = {};
    for (const [key, value] of Object.entries(raw)) {
      if (value === "" || value === null || value === undefined) continue;

      if (key === "tiene_plan") {
        limpio[key] = value === "true" || value === true;
        continue;
      }
      if (CAMPOS_INT.includes(key)) {
        const n = parseInt(value);
        if (!isNaN(n)) limpio[key] = n;
        continue;
      }
      if (CAMPOS_FLOAT.includes(key)) {
        const n = parseFloat(value);
        if (!isNaN(n)) limpio[key] = n;
        continue;
      }

      limpio[key] = value;
    }

    if (Object.keys(limpio).length > 0) out[seccion] = limpio;
  }

  return out;
}

/**
 * Envía los datos de la empresa al backend y retorna el resultado.
 * @param {object} form - datos del formulario
 * @returns {Promise<object>} - respuesta del backend
 * @throws {Error} - con mensaje legible si algo falla
 */
export async function evaluarEmpresa(form) {
  const payload = limpiarPayload(form);

  try {
    const { data } = await api.post("/evaluar", payload);
    return data;
  } catch (error) {
    if (error.response) {
      // Error HTTP del backend (422, 500, etc)
      const mensaje =
        error.response.data?.message ||
        JSON.stringify(error.response.data?.errors || error.response.data);
      throw new Error(`Error ${error.response.status}: ${mensaje}`, { cause: error });
    }
    if (error.request) {
      // No hubo respuesta del servidor
      throw new Error("No se pudo conectar al servidor. Verificá que el backend esté corriendo en http://127.0.0.1:8000", { cause: error });

    }
    throw new Error(`Error inesperado: ${error.message}`, { cause: error });
  }
}