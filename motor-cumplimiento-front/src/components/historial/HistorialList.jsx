import { useState } from 'react';
import HistorialCard from './HistorialCard';
import { useHistorial } from '../../hooks/useHistorial';

export default function HistorialList({ onRelanzar }) {
  const { historial, eliminar, limpiar } = useHistorial();
  const [filtro, setFiltro] = useState('');

  const filtrado = historial.filter((h) =>
    h.query.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="historial-list">
      <div className="historial-list__header">
        <h2>Historial de búsquedas</h2>
        <button onClick={limpiar} disabled={historial.length === 0}>
          Limpiar todo
        </button>
      </div>

      <input
        type="text"
        placeholder="Filtrar historial..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="historial-list__filtro"
      />

      {filtrado.length === 0 ? (
        <p className="historial-list__vacio">No hay búsquedas guardadas.</p>
      ) : (
        filtrado.map((item) => (
          <HistorialCard
            key={item.id}
            item={item}
            onEliminar={eliminar}
            onRelanzar={onRelanzar}
          />
        ))
      )}
    </div>
  );
}
