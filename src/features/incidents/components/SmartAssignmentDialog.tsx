import { useState } from "react";
import { MapPin, Clock, Users, Navigation, AlertTriangle } from "lucide-react";
import { useAmbulances } from "../../ambulances/hooks/useAmbulances";
import { useIncidents } from "../hooks/useIncidents";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { calculateDistance, formatTime } from "../../../lib/utils";
import type { Incident } from "../types";

interface SmartAssignmentDialogProps {
  incident: Incident;
  onClose: () => void;
}

export const SmartAssignmentDialog = ({
  incident,
  onClose,
}: SmartAssignmentDialogProps) => {
  const { availableAmbulances } = useAmbulances();
  const { assignAmbulance, isAssigning } = useIncidents();
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<number | null>(
    null
  );

  // Calculate distances and ETAs for each ambulance
  const ambulancesWithDistance = availableAmbulances
    .map((ambulance) => {
      const distance = calculateDistance(
        incident.lat,
        incident.lng,
        ambulance.lat,
        ambulance.lng
      );

      // Estimate ETA based on distance (assuming 40km/h average speed in city)
      const estimatedETA = Math.round((distance / 40) * 60); // minutes

      return {
        ...ambulance,
        distance: distance.toFixed(1),
        estimatedETA,
      };
    })
    .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

  const handleAssign = async () => {
    if (selectedAmbulanceId) {
      try {
        await assignAmbulance({
          incidentId: incident.id,
          ambulanceId: selectedAmbulanceId,
        });
        onClose();
      } catch (error) {
        console.error("Assignment failed:", error);
      }
    }
  };

  if (availableAmbulances.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Aucune ambulance disponible
            </h2>
            <p className="text-gray-600 mb-4">
              Toutes les ambulances sont actuellement occupées ou en
              maintenance.
            </p>
            <Button onClick={onClose} variant="secondary" className="w-full">
              Fermer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Assigner une ambulance
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="danger" size="sm">
                {incident.severity}
              </Badge>
              <h3 className="font-semibold">{incident.type}</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{incident.address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Clock className="w-4 h-4" />
              <span>Signalé à {formatTime(incident.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            Ambulances disponibles ({ambulancesWithDistance.length})
          </h3>

          {ambulancesWithDistance.map((ambulance, index) => (
            <div
              key={ambulance.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedAmbulanceId === ambulance.id
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedAmbulanceId(ambulance.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-lg font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{ambulance.name}</span>
                      <Badge variant="secondary" size="sm">
                        Type {ambulance.type}
                      </Badge>
                      {index === 0 && (
                        <Badge variant="success" size="sm">
                          Plus proche
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        <span>{ambulance.distance} km</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>~{ambulance.estimatedETA} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{ambulance.crew?.length || 0} membres</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      selectedAmbulanceId === ambulance.id
                        ? "border-red-500 bg-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedAmbulanceId === ambulance.id && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                    )}
                  </div>
                </div>
              </div>

              {ambulance.crew && ambulance.crew.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Équipage:</span>
                    <div className="flex gap-1">
                      {ambulance.crew.map((member, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={onClose}
            disabled={isAssigning}
          >
            Annuler
          </Button>
          <Button
            className="flex-1"
            onClick={handleAssign}
            loading={isAssigning}
            disabled={!selectedAmbulanceId || isAssigning}
          >
            Assigner l'ambulance
          </Button>
        </div>
      </div>
    </div>
  );
};
