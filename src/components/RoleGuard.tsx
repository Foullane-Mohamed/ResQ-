import React from "react";
import { useAuth } from "../hooks/useAuth";
import { hasPermission, type Permission } from "../lib/permissions";

interface RoleGuardProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  permission,
  children,
  fallback = null,
}) => {
  const { user } = useAuth();

  if (!hasPermission(user, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface RoleBasedNavigationProps {
  user: any;
}

export const RoleBasedNavigation: React.FC<RoleBasedNavigationProps> = ({
  user,
}) => {
  if (!user) return null;

  const getNavigationItems = () => {
    const items = [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: "LayoutDashboard",
        permission: "VIEW_AMBULANCE_MAP" as Permission,
      },
    ];

    if (hasPermission(user, "VIEW_AMBULANCE_MAP")) {
      items.push({
        name: "Carte des Interventions",
        path: "/map",
        icon: "Map",
        permission: "VIEW_AMBULANCE_MAP" as Permission,
      });
    }

    if (hasPermission(user, "VIEW_INCIDENT_HISTORY")) {
      items.push({
        name: "Historique des Incidents",
        path: "/incidents",
        icon: "History",
        permission: "VIEW_INCIDENT_HISTORY" as Permission,
      });
    }

    if (hasPermission(user, "VIEW_FLEET_STATUS")) {
      items.push({
        name: "Gestion de la Flotte",
        path: "/fleet",
        icon: "Ambulance",
        permission: "VIEW_FLEET_STATUS" as Permission,
      });
    }

    return items.filter((item) => hasPermission(user, item.permission));
  };

  return getNavigationItems();
};
