import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, MapPin, Plus } from "lucide-react";
import { useIncidents } from "../hooks/useIncidents";
import { useAmbulances } from "../hooks/useAmbulances";
import {
  incidentSchema,
  type IncidentFormValues,
} from "../lib/validations/incidentValidation";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

interface CreateIncidentFormProps {
  onSuccess?: () => void;
}

export const CreateIncidentForm = ({ onSuccess }: CreateIncidentFormProps) => {
  const { createIncident, isCreating } = useIncidents();
  const { findNearest } = useAmbulances();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      severity: "HIGH",
    },
  });

  const severity = watch("severity");

  const onSubmit = async (data: IncidentFormValues) => {
    try {
      await createIncident(data);
      reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating incident:", error);
    }
  };

  const severityOptions = [
    { value: "CRITICAL", label: "Critique", color: "text-red-600" },
    { value: "HIGH", label: "Élevée", color: "text-orange-600" },
    { value: "MODERATE", label: "Modérée", color: "text-yellow-600" },
    { value: "LOW", label: "Faible", color: "text-green-600" },
  ] as const;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Type d'incident *
        </label>
        <Input
          {...register("type")}
          placeholder="Ex: Accident de voiture, malaise cardiaque..."
          error={errors.type?.message}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Adresse *</label>
        <Input
          {...register("address")}
          placeholder="Adresse complète de l'incident"
          icon={MapPin}
          error={errors.address?.message}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Gravité *</label>
        <select
          {...register("severity")}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition-colors focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
        >
          {severityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.severity && (
          <p className="text-xs text-red-500">{errors.severity.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Description (optionnelle)
        </label>
        <textarea
          {...register("description")}
          placeholder="Détails supplémentaires sur l'incident..."
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition-colors focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 min-h-[80px] resize-none"
        />
      </div>

      {severity === "CRITICAL" && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-medium">
            Incident critique - Priorité maximale
          </span>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        loading={isCreating}
        disabled={isCreating}
        icon={Plus}
      >
        Créer l'incident
      </Button>
    </form>
  );
};
