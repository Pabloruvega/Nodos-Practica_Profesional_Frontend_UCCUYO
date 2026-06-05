import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Componente reutilizable que envuelve cada sección del formulario.
 *
 * Uso:
 *   <SeccionRequisito emoji="" titulo="REQ-001 · Seguro de Accidentes">
 *     <Campo ... />
 *     <Campo ... />
 *   </SeccionRequisito>
 *
 * Props:
 *   @param {string}    emoji   - ícono que acompaña el título
 *   @param {string}    titulo  - nombre del requisito
 *   @param {ReactNode} children - campos del formulario
 */
export default function SeccionRequisito({ emoji, titulo, children }) {
  return (
    <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold tracking-widest uppercase text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
          <span>{emoji}</span>
          <span>{titulo}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}