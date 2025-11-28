import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  Ambulance,
  History,
  Siren,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/Button";
import { hasPermission } from "../lib/permissions";
import { CriticalIncidentNotifications } from "./CriticalIncidentNotifications";
import clsx from "clsx";

export default function Layout() {
  const { user, logout, isLogoutLoading } = useAuth();

  const allNavItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      permission: "VIEW_AMBULANCE_MAP",
    },
    {
      name: "Carte des Interventions",
      path: "/map",
      icon: Map,
      permission: "VIEW_AMBULANCE_MAP",
    },
    {
      name: "Gestion de la Flotte",
      path: "/fleet",
      icon: Ambulance,
      permission: "VIEW_FLEET_STATUS",
    },
    {
      name: "Historique des Incidents",
      path: "/incidents",
      icon: History,
      permission: "VIEW_INCIDENT_HISTORY",
    },
  ];

  const navItems = allNavItems.filter(
    (item) => user && hasPermission(user, item.permission as any)
  );
  return (
    <div className="flex h-screen bg-gray-100 text-slate-800 font-sans">
      {hasPermission(user, "RECEIVE_CRITICAL_NOTIFICATIONS") && (
        <CriticalIncidentNotifications />
      )}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Siren className="w-8 h-8 text-red-600 mr-2" />
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            ResQ
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-red-50 text-red-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t space-y-3">
          <div className="flex items-center gap-2 px-2 py-1 text-sm">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 truncate">{user?.name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
            onClick={logout}
            loading={isLogoutLoading}
            icon={LogOut}
          >
            Se déconnecter
          </Button>
          <div className="text-xs text-gray-400 text-center">
            &copy; 2025 ResQ Systems
          </div>
        </div>
      </aside>{" "}
      <main className="flex-1 ml-64 overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-700">
            Medical Dispatch Console
          </h2>
        </header>
        <div className="p-8">
          {" "}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
