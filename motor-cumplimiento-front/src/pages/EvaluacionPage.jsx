import { useNavigate } from "react-router-dom";
import FormularioEvaluacion from "@/components/evaluacion/FormularioEvaluacion";
import { agregarBusqueda } from "@/services/historialService";

export default function EvaluacionPage() {
  const navigate = useNavigate();

  const handleResultado = (resultado) => {
    // Ahora pasamos el resultado completo al historial
    agregarBusqueda(resultado.empresa, resultado.estado_general, resultado);
    navigate("/resultado", { state: { resultado } });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Evaluación de Cumplimiento
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Completá los datos de la empresa para evaluar los 5 requisitos normativos.
        </p>
      </div>
      <FormularioEvaluacion onResultado={handleResultado} />
    </div>
  );
}