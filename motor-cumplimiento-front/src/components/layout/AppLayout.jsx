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