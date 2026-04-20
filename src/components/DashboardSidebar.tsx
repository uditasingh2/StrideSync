import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Footprints, Activity, Bell, Stethoscope,
  FileText, Settings, ChevronLeft, ChevronRight, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard?tab=overview" },
  { icon: Footprints, label: "Step Analysis", path: "/dashboard?tab=daily" },
  { icon: Activity, label: "Gait Patterns", path: "/analytics" },
  { icon: Bell, label: "Health Alerts", path: "/dashboard?tab=alerts", badge: 3 },
  { icon: Stethoscope, label: "Doctor Consultation", path: "/dashboard?tab=recommendations" },
  { icon: FileText, label: "Reports", path: "/dashboard?tab=weekly" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isItemActive = (itemPath: string) => {
    const [pathname, search] = itemPath.split("?");
    if (pathname !== location.pathname) return false;
    if (!search) return true;
    const params = new URLSearchParams(search);
    const currentParams = new URLSearchParams(location.search);
    const tab = params.get("tab");
    const currentTab = currentParams.get("tab");
    if (tab && currentTab) return tab === currentTab;
    if (tab === "overview" && !currentTab) return true;
    return !tab;
  };

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col border-r bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-16 border-b">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && <span className="font-bold text-lg">StrideSync</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = isItemActive(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge variant="destructive" className="h-5 min-w-5 text-xs flex items-center justify-center">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t p-2 flex items-center justify-between">
        <ThemeToggle />
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}
