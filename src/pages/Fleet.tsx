import {
  useAmbulances,
  AddAmbulanceDialog,
  type AmbulanceStatus,
} from "../features/ambulances";
import {
  Car,
  AlertCircle,
  Wrench,
  CheckCircle2,
  Filter,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { RoleGuard } from "../components/RoleGuard";
import { useAuth } from "../features/auth";
import { useState } from "react";
import { hasPermission } from "../lib/permissions";
import { FleetMaintenancePanel } from "../components/FleetMaintenancePanel";

export default function Fleet() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"ALL" | AmbulanceStatus>("ALL");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const {
    ambulances: filteredAmbulances,
    allAmbulances,
    updateStatus,
    isLoading,
    isUpdating,
    stats,
  } = useAmbulances(filter);

  const handleStatusChange = (id: number, newStatus: AmbulanceStatus) => {
    updateStatus({ id, status: newStatus });
  };

  const getStatusBadge = (status: AmbulanceStatus) => {
    const variants = {
      AVAILABLE: "success",
      BUSY: "warning",
      MAINTENANCE: "secondary",
    } as const;
    return variants[status] || "default";
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-slate-500">
        Loading Fleet data...
      </div>
    );
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {" "}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Fleet Management
          </h1>
          <RoleGuard permission="VIEW_FLEET_STATUS">
            <div className="flex gap-4 mt-3">
              <div className="bg-green-100 px-3 py-1 rounded-lg">
                <span className="text-green-800 text-sm font-medium">
                  {stats?.available || 0} Disponibles
                </span>
              </div>
              <div className="bg-orange-100 px-3 py-1 rounded-lg">
                <span className="text-orange-800 text-sm font-medium">
                  {stats?.busy || 0} En Mission
                </span>
              </div>
              <div className="bg-gray-100 px-3 py-1 rounded-lg">
                <span className="text-gray-800 text-sm font-medium">
                  {stats?.maintenance || 0} En Maintenance
                </span>
              </div>
            </div>
          </RoleGuard>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            <Filter className="w-4 h-4 text-slate-400 ml-2" />
            <select
              className="bg-transparent border-none text-sm focus:ring-0 text-slate-600 font-medium"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="ALL">All Vehicles</option>
              <option value="AVAILABLE">Available</option>
              <option value="BUSY">Busy</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>{" "}
          <RoleGuard permission="ADD_REMOVE_VEHICLES">
            <Button icon={Plus} onClick={() => setShowAddDialog(true)}>
              Add Ambulance
            </Button>
          </RoleGuard>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-gray-200 uppercase text-xs font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Vehicle ID</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Crew Members</th>
                <th className="px-6 py-4">Current Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAmbulances?.map((amb) => (
                <tr
                  key={amb.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Car className="w-5 h-5" />
                    </div>
                    {amb.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Type {amb.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2 overflow-hidden">
                      {amb.crew?.map((member, i) => (
                        <div
                          key={i}
                          title={member}
                          className="flex h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 items-center justify-center text-xs font-bold text-slate-600"
                        >
                          {member.charAt(0)}
                        </div>
                      ))}
                    </div>
                  </td>{" "}
                  <td className="px-6 py-4">
                    <Badge
                      variant={getStatusBadge(amb.status)}
                      className="gap-1"
                    >
                      {amb.status === "AVAILABLE" && (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      {amb.status === "BUSY" && (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {amb.status === "MAINTENANCE" && (
                        <Wrench className="w-3 h-3" />
                      )}
                      {amb.status}
                    </Badge>
                  </td>{" "}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <RoleGuard
                        permission="MANAGE_VEHICLE_AVAILABILITY"
                        fallback={
                          <span className="text-xs text-gray-500">-</span>
                        }
                      >
                        <select
                          className="text-xs border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white py-1 pl-2 pr-7"
                          value={amb.status}
                          onChange={(e) =>
                            handleStatusChange(
                              amb.id,
                              e.target.value as AmbulanceStatus
                            )
                          }
                          disabled={isUpdating}
                        >
                          <option value="AVAILABLE">Set Available</option>
                          <option value="BUSY">Set Busy</option>
                          <option value="MAINTENANCE">Set Maintenance</option>
                        </select>
                      </RoleGuard>

                      <RoleGuard permission="ADD_REMOVE_VEHICLES">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            if (
                              confirm(
                                `Êtes-vous sûr de vouloir supprimer ${amb.name}?`
                              )
                            ) {
                              // TODO: Implement remove vehicle functionality
                              console.log("Remove vehicle:", amb.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </RoleGuard>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAmbulances?.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-slate-500">
              No ambulances found with this filter.
            </p>
          </div>
        )}{" "}
      </div>{" "}
      {showAddDialog && (
        <AddAmbulanceDialog onClose={() => setShowAddDialog(false)} />
      )}
      {/* Maintenance Panel for Chef de Parc */}
      <FleetMaintenancePanel />
    </div>
  );
}
