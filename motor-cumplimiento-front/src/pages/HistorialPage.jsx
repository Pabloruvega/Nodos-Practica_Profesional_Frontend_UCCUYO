import HistorialList from '../components/historial/HistorialList';
import { useNavigate } from 'react-router-dom';

export default function HistorialPage() {
  const navigate = useNavigate();

  // Cuando el usuario relanza una búsqueda, lo manda a ResultadoPage
  const handleRelanzar = (query) => {
    navigate(`/resultados?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="page historial-page">
      <HistorialList onRelanzar={handleRelanzar} />
    </div>
  );
}