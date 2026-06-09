/**
 * Barra de progreso del formulario.
 * Muestra cuántas secciones tienen al menos un campo completado de 5.
 *
 * Props:
 *   @param {number} completadas - secciones con al menos un campo lleno
 *   @param {number} total       - total de secciones (siempre 5)
 */
export default function BarraProgreso({ completadas, total = 5 }) {
  const porcentaje = Math.round((completadas / total) * 100);

  const color =
    porcentaje === 100 ? 'bg-emerald-500' :
    porcentaje >= 60   ? 'bg-primary' :
    porcentaje >= 20   ? 'bg-yellow-500' :
                         'bg-border';

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          Progreso del formulario
        </span>
        <span className="text-xs font-semibold text-foreground">
          {completadas} / {total} secciones
        </span>
      </div>

      {/* Track */}
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${porcentaje}%` }}
        />
      </div>

      {/* Indicadores por sección */}
      <div className="flex gap-1.5 pt-0.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-all duration-300 ${
              i < completadas ? color : 'bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  );
}