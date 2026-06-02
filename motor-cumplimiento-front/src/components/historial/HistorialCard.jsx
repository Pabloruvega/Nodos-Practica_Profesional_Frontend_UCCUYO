export default function HistorialCard({ item, onEliminar, onRelanzar }) {
  const fecha = new Date(item.fecha).toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="historial-card">
      <div className="historial-card__info">
        <span className="historial-card__query">{item.query}</span>
        <span className="historial-card__meta">
          <span className="historial-card__categoria">{item.categoria}</span>
          <span className="historial-card__fecha">{fecha}</span>
        </span>
      </div>
      <div className="historial-card__acciones">
        <button onClick={() => onRelanzar(item.query)} title="Buscar de nuevo">
          🔍
        </button>
        <button onClick={() => onEliminar(item.id)} title="Eliminar">
          🗑️
        </button>
      </div>
    </div>
  );
}