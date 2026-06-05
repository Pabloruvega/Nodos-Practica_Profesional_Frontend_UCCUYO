import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * Página 404 — ruta no encontrada.
 * Animación simple de entrada y botón para volver al inicio.
 */
export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h1 className="text-6xl font-bold text-primary mb-2">404</h1>

      <p className="text-lg font-semibold text-foreground mb-1">
        Página no encontrada
      </p>
      <p className="text-sm text-muted-foreground mb-8 max-w-xs">
        La ruta que buscás no existe. Revisá la URL o volvé al inicio.
      </p>

      <button
        onClick={() => navigate("/")}
        className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
      >
        Volver al inicio
      </button>
    </motion.div>
  );
}