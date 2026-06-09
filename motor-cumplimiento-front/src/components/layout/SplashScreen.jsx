import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Pantalla de splash que se muestra al iniciar la app.
 * Muestra el logo centrado con una barra de progreso animada.
 * Cuando termina llama a onComplete para mostrar la app.
 *
 * Props:
 *   @param {function} onComplete - callback cuando termina la animación
 */
export default function SplashScreen({ onComplete }) {
  const [progreso, setProgreso] = useState(0);
  const [saliendo, setSaliendo] = useState(false);

  useEffect(() => {
    // Avanza el progreso en intervalos irregulares (más realista)
   const pasos = [
    { hasta: 30,  demora: 20 },
    { hasta: 60,  demora: 30 },
    { hasta: 80,  demora: 50 },
    { hasta: 95,  demora: 80 },
    { hasta: 100, demora: 40 },
];

    let progresoCurrent = 0;
    let timeout;

    function avanzar(pasoIndex) {
      if (pasoIndex >= pasos.length) {
        // Progreso completo — iniciar salida
        setTimeout(() => {
          setSaliendo(true);
          setTimeout(onComplete, 300);
        }, 200);
        return;
      }

      const { hasta, demora } = pasos[pasoIndex];

      function tick() {
        progresoCurrent += 1;
        setProgreso(progresoCurrent);
        if (progresoCurrent < hasta) {
          timeout = setTimeout(tick, demora);
        } else {
          avanzar(pasoIndex + 1);
        }
      }

      timeout = setTimeout(tick, demora);
    }

    avanzar(0);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!saliendo && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center gap-6 mb-16"
          >
            <img
              src="/src/assets/logo.png"
              alt="Logo Minero"
              className="w-24 h-24 object-contain mix-blend-multiply dark:mix-blend-screen"
            />
            <div className="text-center">
              <p className="text-lg font-bold text-foreground tracking-tight">
                Motor de Cumplimiento
              </p>
              <p className="text-sm text-muted-foreground">
                Normativo Minero · UCCUYO
              </p>
            </div>
          </motion.div>

          {/* Barra de progreso */}
          <div className="absolute bottom-0 left-0 w-full">
            {/* Barra delgada tipo YouTube */}
            <div className="w-full h-1 bg-secondary">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progreso}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}