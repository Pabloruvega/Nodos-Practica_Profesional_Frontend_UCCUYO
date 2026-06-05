import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const NAV_ITEMS = [
  {
    label: "Evaluación",
    path: "/",
    icon: "⛏️",
    description: "Evaluar empresa",
  },
  {
    label: "Historial",
    path: "/historial",
    icon: "📋",
    description: "Evaluaciones anteriores",
  },
];

/**
 * Sidebar principal de la aplicación.
 * Usa el componente Sidebar de shadcn/ui.
 * La navegación se maneja con React Router.
 */
export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar>
      {/* Logo / título */}
      <SidebarHeader className="border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⛏</span>
          <div>
            <p className="text-sm font-bold text-foreground leading-tight">
              Motor de Cumplimiento
            </p>
            <p className="text-xs text-muted-foreground">
              Normativo Minero · UCCUYO
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Navegación */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                    className="cursor-pointer"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-border px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Práctica Profesional · UCCUYO
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}