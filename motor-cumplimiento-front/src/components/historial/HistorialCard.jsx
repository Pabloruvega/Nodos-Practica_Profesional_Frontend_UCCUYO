
const categoriaBadge = {
  Oro:     'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  Litio:   'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  Cobre:   'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  Plata:   'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300',
  General: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
};

export default function HistorialCard({ item, onEliminar, onRelanzar }) {
  const fecha = new Date(item.fecha).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const badgeClass = categoriaBadge[item.categoria] ?? categoriaBadge.General;

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-150">

      {/* Info */}
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
          {item.query}
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeClass}`}>
            {item.categoria}
          </span>
          <span className="text-xs text-zinc-500">{fecha}</span>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onRelanzar(item.query)}
          title="Buscar de nuevo"
          className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-150"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </button>
        <button
          onClick={() => onEliminar(item.id)}
          title="Eliminar"
          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-150"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M3 7h18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
