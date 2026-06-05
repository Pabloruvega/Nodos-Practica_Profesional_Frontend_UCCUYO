import { useNavigate, useLocation } from "react-router-dom";
import { getHistorial } from "@/services/historialService";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

/**
 * Sidebar principal de la aplicación.
 * Muestra un badge con la cantidad de evaluaciones guardadas en el historial.
 */
export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const cantidadHistorial = getHistorial().length;

  const NAV_ITEMS = [
    {
      label: "Evaluación",
      path: "/",
      icon: null,
      badge: null,
    },
    {
      label: "Historial",
      path: "/historial",
      icon: null,
      badge: cantidadHistorial > 0 ? cantidadHistorial : null,
    },
  ];

  return (
    <Sidebar>
      {/* Logo / título */}
      <SidebarHeader className="border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <img
            src="/src/assets/logo.png"
            alt="Logo Minero"
            className="w-10 h-10 object-contain mix-blend-multiply dark:mix-blend-screen"
          />
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
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  )}
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