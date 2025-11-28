import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { useIncidents } from "../hooks/useIncidents";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { SmartAssignmentDialog } from "./SmartAssignmentDialog";
import { formatDateTime } from "../lib/utils";
import type { Incident } from "../services/incidentsService";

interface IncidentCardProps {
  incident: Incident;
}

export const IncidentCard = ({ incident }: IncidentCardProps) => {
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);
  const { resolveIncident, isResolving } = useIncidents();

  const handleAssignAmbulance = () => {
    setShowAssignmentDialog(true);
  };

  const handleResolve = () => {
    resolveIncident(incident.id);
  };

  const severityVariant = {
    CRITICAL: "danger",
    HIGH: "warning",
    MODERATE: "warning",
    LOW: "success",
  }[incident.severity] as any;

  const statusVariant = {
    PENDING: "secondary",
    IN_PROGRESS: "warning",
    RESOLVED: "success",
  }[incident.status] as any;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100 hover:border-red-100 hover:bg-red-50/30 transition-all group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Badge variant={severityVariant} size="sm">
            {incident.severity === "CRITICAL" && (
              <AlertTriangle className="w-3 h-3" />
            )}
            {incident.severity}
          </Badge>
          <h3 className="font-semibold text-slate-800">{incident.type}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusVariant} size="sm">
            {incident.status === "RESOLVED" ? (
              <CheckCircle2 className="w-3 h-3" />
            ) : (
              <Clock className="w-3 h-3" />
            )}
            {incident.status}
          </Badge>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span>{incident.address}</span>
        </div>

        {incident.assignedAmbulanceId && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Users className="w-4 h-4 text-slate-400" />
            <span>Ambulance #{incident.assignedAmbulanceId} assignée</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3 h-3" />
          <span>{formatDateTime(incident.createdAt)}</span>
        </div>
      </div>

      {incident.description && (
        <div className="mb-3 p-2 bg-slate-50 rounded text-sm text-slate-600">
          {incident.description}
        </div>
      )}

      <div className="flex gap-2">
        {incident.status === "PENDING" && (
          <Button size="sm" variant="primary" onClick={handleAssignAmbulance}>
            Assigner ambulance
          </Button>
        )}
        {incident.status === "IN_PROGRESS" && (
          <Button
            size="sm"
            variant="secondary"
            onClick={handleResolve}
            loading={isResolving}
            disabled={isResolving}
          >
            Marquer comme résolu
          </Button>
        )}
      </div>

      {showAssignmentDialog && (
        <SmartAssignmentDialog
          incident={incident}
          onClose={() => setShowAssignmentDialog(false)}
        />
      )}
    </div>
  );
};
