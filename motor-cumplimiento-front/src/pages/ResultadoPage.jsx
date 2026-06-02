import { useLocation, useNavigate } from 'react-router-dom'

const COLORES = {
  CUMPLE:        'text-emerald-400 border-emerald-800 bg-emerald-950',
  POR_VENCER:    'text-yellow-400  border-yellow-800  bg-yellow-950',
  NO_CUMPLE:     'text-red-400     border-red-800     bg-red-950',
  DATO_FALTANTE: 'text-zinc-400    border-zinc-700    bg-zinc-900',
}

export default function ResultadoPage() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state?.resultado) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-zinc-400">No hay resultado para mostrar.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-sm text-blue-400 underline">
          Volver a evaluación
        </button>
      </div>
    )
  }

  const { resultado } = state
  const cumpleGeneral = resultado.estado_general === 'CUMPLE'

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
          Resultado de Evaluación
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          {resultado.empresa} · {resultado.fecha_evaluacion}
        </p>
      </div>

      {/* Estado general */}
      <div className={`rounded-lg border px-6 py-4 ${cumpleGeneral ? 'bg-emerald-950 border-emerald-800' : 'bg-red-950 border-red-800'}`}>
        <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Estado general</p>
        <p className={`text-2xl font-bold ${cumpleGeneral ? 'text-emerald-400' : 'text-red-400'}`}>
          {cumpleGeneral ? 'CUMPLE' : 'NO CUMPLE'}
        </p>
        <p className="text-sm text-zinc-400 mt-2">
          {resultado.requisitos_cumplidos} de 5 requisitos cumplidos
          {resultado.requisitos_no_cumple > 0 && ` · ${resultado.requisitos_no_cumple} incumplidos`}
          {resultado.requisitos_faltantes > 0 && ` · ${resultado.requisitos_faltantes} sin datos`}
        </p>
      </div>

      {/* Detalle por requisito */}
      <div className="space-y-3">
        {resultado.detalle.map((req) => (
          <div key={req.id} className={`rounded-lg border px-4 py-3 ${COLORES[req.estado]}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono font-semibold">{req.id}</span>
              <span className="text-xs font-semibold uppercase tracking-wider">{req.estado.replace('_', ' ')}</span>
            </div>
            <p className="text-sm text-zinc-300 font-medium">{req.nombre}</p>
            <p className="text-xs text-zinc-400 mt-1">{req.observacion}</p>
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/')} className="text-sm text-blue-400 underline">
        Nueva evaluación
      </button>
    </div>
  )
}