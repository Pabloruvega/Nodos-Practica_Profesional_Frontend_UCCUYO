import HistorialList from '../components/historial/HistorialList';
import { useNavigate } from 'react-router-dom';

export default function HistorialPage() {
  const navigate = useNavigate();

  // Cuando el usuario relanza una búsqueda, lo manda a ResultadoPage
  const handleRelanzar = (query) => {
    navigate(`/resultados?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Historial</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Búsquedas recientes guardadas localmente.
        </p>
      </div>
      <HistorialList onRelanzar={handleRelanzar} />
    </div>
  );
}