import { useState } from 'react';
import HistorialCard from './HistorialCard';
import { useHistorial } from '../../hooks/useHistorial';

export default function HistorialList({ onRelanzar }) {
  const { historial, eliminar, limpiar } = useHistorial();
  const [filtro, setFiltro] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');

  const categorias = ['Todos', 'Oro', 'Litio', 'Cobre', 'Plata', 'General'];

  const filtrado = historial.filter((h) => {
    const matchTexto = h.query.toLowerCase().includes(filtro.toLowerCase());
    const matchCat = categoriaActiva === 'Todos' || h.categoria === categoriaActiva;
    return matchTexto && matchCat;
  });

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Búsquedas recientes
          <span className="ml-2 font-normal text-zinc-500">
            ({historial.length})
          </span>
        </h2>
        <button
          onClick={limpiar}
          disabled={historial.length === 0}
          className="text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
        >
          Limpiar todo
        </button>
      </div>

      {/* Buscador */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Filtrar historial..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:border-transparent transition"
        />
      </div>

      {/* Filtros por categoría */}
      <div className="flex flex-wrap gap-2">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaActiva(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150
              ${categoriaActiva === cat
                ? 'bg-black text-white border-black'
                : 'bg-white text-zinc-600 border-zinc-300 hover:border-zinc-400 hover:text-zinc-900'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lista */}
      {filtrado.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-zinc-400 dark:text-zinc-600 gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
          </svg>
          <span className="text-sm">No hay búsquedas guardadas.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtrado.map((item) => (
            <HistorialCard
              key={item.id}
              item={item}
              onEliminar={eliminar}
              onRelanzar={onRelanzar}
            />
          ))}
        </div>
      )}
    </div>
  );
}