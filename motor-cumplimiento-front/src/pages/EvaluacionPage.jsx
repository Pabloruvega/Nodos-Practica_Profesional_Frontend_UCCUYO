import { useNavigate } from "react-router-dom";
import FormularioEvaluacion from "@/components/evaluacion/FormularioEvaluacion";
import { agregarBusqueda } from "@/services/historialService";

/**
 * Página principal de evaluación.
 *
 * Flujo:
 *   1. Muestra el formulario
 *   2. El formulario llama al backend y devuelve el resultado via onResultado
 *   3. Esta página guarda el resultado en historialService via agregarBusqueda
 *   4. Redirige a /resultado pasando los datos via state de React Router
 */
export default function EvaluacionPage() {
  const navigate = useNavigate();

  const handleResultado = (resultado) => {
    // Guardamos el nombre de la empresa como query y el estado general como categoría
    agregarBusqueda(resultado.empresa, resultado.estado_general);

    navigate("/resultado", { state: { resultado } });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Evaluación de Cumplimiento
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Completá los datos de la empresa para evaluar los 5 requisitos normativos.
        </p>
      </div>

      <FormularioEvaluacion onResultado={handleResultado} />
    </div>
  );
}