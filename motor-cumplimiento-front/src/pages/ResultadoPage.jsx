import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

/**
 * Página de resultado con animaciones de entrada.
 * Cada requisito aparece con un fade + slide escalonado.
 */

const ESTILOS_ESTADO = {
  CUMPLE:        { card: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800', texto: 'text-emerald-700 dark:text-emerald-400', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300' },
  POR_VENCER:    { card: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800',   texto: 'text-yellow-700 dark:text-yellow-400',   badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
  NO_CUMPLE:     { card: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',               texto: 'text-red-700 dark:text-red-400',         badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
  DATO_FALTANTE: { card: 'bg-card border-border',                                                       texto: 'text-muted-foreground',                 badge: 'bg-secondary text-secondary-foreground' },
}

// Variantes de animación para el contenedor y los hijos
const contenedorVariants = {
  oculto: {},
  visible: {
    transition: { staggerChildren: 0.1 }, // cada hijo aparece 100ms después del anterior
  },
}

const itemVariants = {
  oculto:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

export default function ResultadoPage() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state?.resultado) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-muted-foreground">No hay resultado para mostrar.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-sm text-primary underline hover:opacity-80"
        >
          Volver a evaluación
        </button>
      </div>
    )
  }

  const { resultado } = state
  const cumpleGeneral = resultado.estado_general === 'CUMPLE'
  const estiloGeneral = ESTILOS_ESTADO[resultado.estado_general] ?? ESTILOS_ESTADO.DATO_FALTANTE

  return (
    <motion.div
      className="max-w-3xl mx-auto px-4 py-8 space-y-6"
      variants={contenedorVariants}
      initial="oculto"
      animate="visible"
    >
      {/* Encabezado */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Resultado de Evaluación
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {resultado.empresa} · {resultado.fecha_evaluacion}
        </p>
      </motion.div>

      {/* Estado general */}
      <motion.div
        variants={itemVariants}
        className={`rounded-lg border px-6 py-5 ${estiloGeneral.card}`}
      >
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          Estado general
        </p>
        <p className={`text-2xl font-bold ${estiloGeneral.texto}`}>
          {cumpleGeneral ? 'CUMPLE' : 'NO CUMPLE'}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {resultado.requisitos_cumplidos} de 5 requisitos cumplidos
          {resultado.requisitos_no_cumple > 0 && ` · ${resultado.requisitos_no_cumple} incumplidos`}
          {resultado.requisitos_faltantes > 0 && ` · ${resultado.requisitos_faltantes} sin datos`}
        </p>
      </motion.div>

      {/* Detalle por requisito — cada uno aparece escalonado */}
      <div className="space-y-3">
        {resultado.detalle.map((req) => {
          const estilo = ESTILOS_ESTADO[req.estado] ?? ESTILOS_ESTADO.DATO_FALTANTE
          return (
            <motion.div
              key={req.id}
              variants={itemVariants}
              className={`rounded-lg border px-4 py-3 ${estilo.card}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-semibold text-muted-foreground">
                  {req.id}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${estilo.badge}`}>
                  {req.estado.replace('_', ' ')}
                </span>
              </div>
              <p className={`text-sm font-medium ${estilo.texto}`}>{req.nombre}</p>
              <p className="text-xs text-muted-foreground mt-1">{req.observacion}</p>
              {req.dias_restantes !== null && (
                <p className="text-xs text-muted-foreground mt-1">
                  {req.dias_restantes >= 0
                    ? `Vence en ${req.dias_restantes} días`
                    : `Venció hace ${Math.abs(req.dias_restantes)} días`}
                </p>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Acciones */}
      <motion.div variants={itemVariants} className="flex gap-4">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-primary underline hover:opacity-80"
        >
          Nueva evaluación
        </button>
        <button
          onClick={() => navigate('/historial')}
          className="text-sm text-muted-foreground underline hover:opacity-80"
        >
          Ver historial
        </button>
      </motion.div>
    </motion.div>
  )
}