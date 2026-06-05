import { useNavigate } from 'react-router-dom';
import HistorialList from '../components/historial/HistorialList';

export default function HistorialPage() {
  const navigate = useNavigate();

  // Al hacer click en el ojo, navega a /resultado con el resultado guardado
  const handleVerDetalle = (resultado) => {
    navigate('/resultado', { state: { resultado } });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Historial
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Evaluaciones recientes guardadas localmente.
        </p>
      </div>
      <HistorialList onVerDetalle={handleVerDetalle} />
    </div>
  );
}