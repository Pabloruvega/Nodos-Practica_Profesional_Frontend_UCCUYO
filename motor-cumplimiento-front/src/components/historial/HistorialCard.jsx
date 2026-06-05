/**
 * Tarjeta individual del historial.
 * Muestra el nombre de la empresa, el estado de cumplimiento y la fecha.
 * Los badges responden al estado real del backend: CUMPLE / NO_CUMPLE.
 */

const estadoBadge = {
  CUMPLE:        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  NO_CUMPLE:     'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  POR_VENCER:    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  DATO_FALTANTE: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
};

const estadoLabel = {
  CUMPLE:        '✔ Cumple',
  NO_CUMPLE:     '✖ No Cumple',
  POR_VENCER:    '⚠ Por Vencer',
  DATO_FALTANTE: '— Sin datos',
};

export default function HistorialCard({ item, onEliminar, onRelanzar }) {
  const fecha = new Date(item.fecha).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const badgeClass = estadoBadge[item.categoria] ?? estadoBadge.DATO_FALTANTE;
  const label = estadoLabel[item.categoria] ?? item.categoria;

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 bg-card border border-border rounded-lg hover:border-ring transition-all duration-150">

      {/* Info */}
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-sm font-medium text-foreground truncate">
          {item.query}
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeClass}`}>
            {label}
          </span>
          <span className="text-xs text-muted-foreground">{fecha}</span>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onRelanzar(item.query)}
          title="Buscar de nuevo"
          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent transition-colors duration-150"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </button>
        <button
          onClick={() => onEliminar(item.id)}
          title="Eliminar"
          className="p-1.5 rounded-lg text-muted-foreground hover:text-danger hover:bg-accent transition-colors duration-150"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M3 7h18" />
          </svg>
        </button>
      </div>
    </div>
  );
}