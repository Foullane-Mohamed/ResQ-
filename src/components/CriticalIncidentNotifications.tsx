import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useIncidents } from "../hooks/useIncidents";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

export const CriticalIncidentNotifications = () => {
  const { criticalIncidents } = useIncidents();
  const [dismissedIncidents, setDismissedIncidents] = useState<
    Set<string | number>
  >(new Set());

  const activeCriticalIncidents = criticalIncidents.filter(
    (incident) => !dismissedIncidents.has(incident.id)
  );

  const dismissNotification = (incidentId: string | number) => {
    setDismissedIncidents((prev) => new Set([...prev, incidentId]));
  };

  useEffect(() => {
    const resolvedIds = criticalIncidents
      .filter((incident) => incident.status === "RESOLVED")
      .map((incident) => incident.id);

    if (resolvedIds.length > 0) {
      setDismissedIncidents((prev) => {
        const newSet = new Set(prev);
        resolvedIds.forEach((id) => newSet.add(id));
        return newSet;
      });
    }
  }, [criticalIncidents]);

  if (activeCriticalIncidents.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-md">
      {activeCriticalIncidents.map((incident) => (
        <div
          key={incident.id}
          className="bg-red-600 text-white p-4 rounded-lg shadow-lg border-l-4 border-red-800 animate-pulse"
        ></div>
      ))}
    </div>
  );
};
