import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/AppSidebar";

/**
 * Layout principal de la aplicación.
 * Envuelve todas las páginas con el sidebar y el trigger para abrirlo/cerrarlo.
 *
 * Props:
 *   @param {ReactNode} children - las páginas de la app
 */
export default function AppLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <div className="flex flex-col flex-1 min-w-0">
          {/* Barra superior con trigger del sidebar */}
          <header className="flex items-center gap-3 border-b border-border px-4 py-3 bg-card">
  <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
  <img
    src="/src/assets/logo.png"
    alt="Logo Minero"
    className="w-7 h-7 object-contain mix-blend-multiply"
  />
  <span className="text-sm text-muted-foreground">
    Motor de Cumplimiento Normativo Minero
  </span>
</header>
          {/* Contenido de la página */}
          <main className="flex-1 overflow-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}