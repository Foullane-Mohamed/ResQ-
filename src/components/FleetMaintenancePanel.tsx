import { useState } from "react";
import {
  Calendar,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
} from "lucide-react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { RoleGuard } from "./RoleGuard";

interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleName: string;
  type: "ROUTINE" | "REPAIR" | "INSPECTION";
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";
  scheduledDate: string;
  completedDate?: string;
  description: string;
  cost?: number;
  technician?: string;
}

const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: "1",
    vehicleId: "1",
    vehicleName: "AMB-01",
    type: "ROUTINE",
    status: "SCHEDULED",
    scheduledDate: "2025-11-28",
    description: "Regular maintenance check - 3 months",
  },
  {
    id: "2",
    vehicleId: "2",
    vehicleName: "AMB-02",
    type: "REPAIR",
    status: "IN_PROGRESS",
    scheduledDate: "2025-11-26",
    description: "Engine repair - cooling system",
    technician: "Michel Dupont",
  },
  {
    id: "3",
    vehicleId: "3",
    vehicleName: "AMB-03",
    type: "INSPECTION",
    status: "OVERDUE",
    scheduledDate: "2025-11-20",
    description: "Annual safety inspection",
  },
];

export const FleetMaintenancePanel = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [records] = useState(mockMaintenanceRecords);

  const getStatusBadge = (status: MaintenanceRecord["status"]) => {
    const variants = {
      SCHEDULED: "secondary",
      IN_PROGRESS: "warning",
      COMPLETED: "success",
      OVERDUE: "danger",
    } as const;
    return variants[status];
  };

  const getStatusIcon = (status: MaintenanceRecord["status"]) => {
    switch (status) {
      case "SCHEDULED":
        return <Clock className="w-4 h-4" />;
      case "IN_PROGRESS":
        return <Wrench className="w-4 h-4" />;
      case "COMPLETED":
        return <CheckCircle2 className="w-4 h-4" />;
      case "OVERDUE":
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: MaintenanceRecord["type"]) => {
    switch (type) {
      case "ROUTINE":
        return "text-blue-600 bg-blue-100";
      case "REPAIR":
        return "text-red-600 bg-red-100";
      case "INSPECTION":
        return "text-green-600 bg-green-100";
    }
  };

  return (
    <RoleGuard permission="MANAGE_VEHICLE_AVAILABILITY">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-slate-800">
            Maintenance Schedule
          </h3>
          <Button size="sm" icon={Plus} onClick={() => setShowAddDialog(true)}>
            Schedule Maintenance
          </Button>
        </div>

        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="font-medium text-gray-900">
                    {record.vehicleName}
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(
                      record.type
                    )}`}
                  >
                    {record.type}
                  </span>
                </div>
                <Badge
                  variant={getStatusBadge(record.status)}
                  className="gap-1"
                >
                  {getStatusIcon(record.status)}
                  {record.status}
                </Badge>
              </div>

              <p className="text-sm text-gray-600 mb-3">{record.description}</p>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Scheduled:{" "}
                  {new Date(record.scheduledDate).toLocaleDateString()}
                </div>
                {record.technician && (
                  <div>Technician: {record.technician}</div>
                )}
              </div>

              {record.status === "IN_PROGRESS" && (
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline">
                    Mark Complete
                  </Button>
                  <Button size="sm" variant="ghost">
                    Update Progress
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {records.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Wrench className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No maintenance records found</p>
          </div>
        )}
      </div>
    </RoleGuard>
  );
};
