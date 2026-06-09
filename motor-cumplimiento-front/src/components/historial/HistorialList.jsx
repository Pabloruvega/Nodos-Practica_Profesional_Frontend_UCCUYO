import { useState } from 'react';
import HistorialCard from './HistorialCard';
import { useHistorial } from '../../hooks/useHistorial';

// Empty state ilustrado con SVG inline temático
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
      <div className="relative">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="38" className="fill-secondary" />
          <rect x="22" y="28" width="36" height="28" rx="3" className="fill-border" />
          <rect x="26" y="33" width="20" height="2.5" rx="1.25" className="fill-muted-foreground opacity-50" />
          <rect x="26" y="39" width="28" height="2.5" rx="1.25" className="fill-muted-foreground opacity-40" />
          <rect x="26" y="45" width="16" height="2.5" rx="1.25" className="fill-muted-foreground opacity-30" />
          <circle cx="54" cy="54" r="10" className="fill-card stroke-border" strokeWidth="1.5" />
          <path d="M50 54h8M54 50v8" className="stroke-muted-foreground" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">Sin evaluaciones aún</p>
        <p className="text-xs text-muted-foreground max-w-xs">
          Las evaluaciones que realices aparecerán acá. Empezá evaluando una empresa.
        </p>
      </div>
    </div>
  );
}

export default function HistorialList({ onVerDetalle }) {
  const { historial, eliminar, limpiar } = useHistorial();
  const [filtro, setFiltro] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');

  const categorias = ['Todos', 'CUMPLE', 'NO_CUMPLE', 'POR_VENCER', 'DATO_FALTANTE'];
  const categoriaLabel = {
    Todos: 'Todos', CUMPLE: 'Cumple', NO_CUMPLE: 'No Cumple',
    POR_VENCER: 'Por Vencer', DATO_FALTANTE: 'Sin datos',
  };

  const filtrado = historial.filter((h) => {
    const matchTexto = h.query.toLowerCase().includes(filtro.toLowerCase());
    const matchCat = categoriaActiva === 'Todos' || h.categoria === categoriaActiva;
    return matchTexto && matchCat;
  });

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">
          Evaluaciones recientes
          <span className="ml-2 font-normal text-muted-foreground">({historial.length})</span>
        </h2>
        <button
          onClick={limpiar}
          disabled={historial.length === 0}
          className="text-xs text-danger hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
        >
          Limpiar todo
        </button>
      </div>

      {/* Buscador */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Filtrar por empresa..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaActiva(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150
              ${categoriaActiva === cat
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:border-ring hover:text-foreground'
              }`}
          >
            {categoriaLabel[cat]}
          </button>
        ))}
      </div>

      {/* Lista o empty state */}
      {historial.length === 0 ? (
        <EmptyState />
      ) : filtrado.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
          <span className="text-sm">No hay resultados para ese filtro.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtrado.map((item) => (
            <HistorialCard
              key={item.id}
              item={item}
              onEliminar={eliminar}
              onVerDetalle={onVerDetalle}
            />
          ))}
        </div>
      )}
    </div>
  );
}