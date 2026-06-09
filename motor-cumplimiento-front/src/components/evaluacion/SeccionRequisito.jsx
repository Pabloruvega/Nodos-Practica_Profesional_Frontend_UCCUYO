import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SeccionRequisito({ emoji, titulo, children, completa, conError }) {
  const borderClass = conError
    ? "border-red-400 dark:border-red-600"
    : completa
    ? "border-emerald-400 dark:border-emerald-600"
    : "border-border";

  return (
    <Card className={`bg-card transition-colors duration-300 ${borderClass}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold tracking-widest uppercase text-zinc-500 dark:text-zinc-400 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>{emoji}</span>
            <span>{titulo}</span>
          </div>
          {completa && (
            <span className="text-emerald-500 font-bold text-base leading-none">✓</span>
          )}
          {conError && (
            <span className="text-red-500 text-xs font-semibold normal-case tracking-normal whitespace-nowrap">
              Incompleto
            </span>
          )}
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