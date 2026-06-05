const HISTORIAL_KEY = 'historial_mineria';

export function getHistorial() {
  const data = localStorage.getItem(HISTORIAL_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Guarda una evaluación completa en el historial.
 * Ahora incluye el resultado completo del backend para poder ver el detalle.
 */
export function agregarBusqueda(query, categoria = 'General', resultado = null) {
  const historial = getHistorial();
  const nueva = {
    id: Date.now(),
    query,
    categoria,
    fecha: new Date().toISOString(),
    resultado, // resultado completo del backend
  };
  const actualizado = [nueva, ...historial].slice(0, 50);
  localStorage.setItem(HISTORIAL_KEY, JSON.stringify(actualizado));
  return actualizado;
}

export function eliminarBusqueda(id) {
  const historial = getHistorial().filter((h) => h.id !== id);
  localStorage.setItem(HISTORIAL_KEY, JSON.stringify(historial));
  return historial;
}

export function limpiarHistorial() {
  localStorage.removeItem(HISTORIAL_KEY);
  return [];
}