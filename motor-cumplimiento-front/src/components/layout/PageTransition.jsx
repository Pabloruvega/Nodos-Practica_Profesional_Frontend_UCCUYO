import { motion } from "framer-motion";

/**
 * Componente reutilizable que envuelve cada página con una animación de fade.
 * 
 * Uso:
 *   <PageTransition>
 *     <MiPagina />
 *   </PageTransition>
 *
 * Props:
 *   @param {ReactNode} children - contenido de la página
 */
export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}