import {
  useIncidents,
  CreateIncidentForm,
  IncidentCard,
  SmartAssignmentDialog,
} from "../features/incidents";
import { RoleGuard } from "../components/RoleGuard";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Navigation } from "lucide-react";
import type { Incident } from "../features/incidents/types";

export default function Incidents() {
  const { incidents, isLoading } = useIncidents();
  const [showForm, setShowForm] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null
  );
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-8rem)]">
        {/* Left Column: Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-0">
            {" "}
            <RoleGuard
              permission="CREATE_INCIDENT"
              fallback={
                <div className="text-center py-8">
                  <p className="text-gray-500">Accès restreint</p>
                  <p className="text-sm text-gray-400">
                    Seuls les régulateurs peuvent créer des incidents
                  </p>
                </div>
              }
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  Nouveau Signalement
                </h2>
                <p className="text-sm text-slate-500">
                  Remplissez ce formulaire pour déclarer une urgence.
                </p>
              </div>
              <CreateIncidentForm onSuccess={() => setShowForm(false)} />
            </RoleGuard>
          </div>
        </div>

        {/* Right Column: List Section */}
        <div className="lg:col-span-2 flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-slate-800">
              Historique des Incidents
            </h2>
            <span className="text-xs bg-slate-200 px-2 py-1 rounded-full text-slate-600">
              {incidents?.length || 0} Total
            </span>
          </div>
          <div className="overflow-y-auto p-4 space-y-3 flex-1">
            {" "}
            {isLoading ? (
              <p className="text-center text-slate-400 py-10">Chargement...</p>
            ) : (
              incidents
                ?.sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((incident) => (
                  <div key={incident.id} className="relative">
                    <IncidentCard incident={incident} />
                    <RoleGuard permission="ASSIGN_AMBULANCE">
                      {incident.status === "PENDING" &&
                        !incident.assignedAmbulanceId && (
                          <Button
                            size="sm"
                            variant="outline"
                            icon={Navigation}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setSelectedIncident(incident)}
                          >
                            Assignation Intelligente
                          </Button>
                        )}
                    </RoleGuard>
                  </div>
                ))
            )}
          </div>{" "}
        </div>
      </div>

      {/* Smart Assignment Dialog for Régulateur users */}
      {selectedIncident && (
        <SmartAssignmentDialog
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
}
