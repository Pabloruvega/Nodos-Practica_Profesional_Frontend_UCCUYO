const HISTORIAL_KEY = 'historial_mineria';

export function getHistorial() {
  const data = localStorage.getItem(HISTORIAL_KEY);
  return data ? JSON.parse(data) : [];
}

export function agregarBusqueda(query, categoria = 'General') {
  const historial = getHistorial();
  const nueva = {
    id: Date.now(),
    query,
    categoria,
    fecha: new Date().toISOString(),
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