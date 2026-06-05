import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/AppSidebar";
import { useTheme } from "@/hooks/useTheme";

export default function AppLayout({ children }) {
  const { dark, toggle } = useTheme();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center gap-3 border-b border-border px-4 py-3 bg-card">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <span className="text-sm text-muted-foreground flex-1">
              Motor de Cumplimiento Normativo Minero
            </span>

            <button
              onClick={toggle}
              aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
              className="rounded-full w-9 h-9 flex items-center justify-center text-lg transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
            >
              {dark ? "☀️" : "🌙"}
            </button>
          </header>

          <main className="flex-1 overflow-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}