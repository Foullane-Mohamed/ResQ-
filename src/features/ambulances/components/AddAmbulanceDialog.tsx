import { Plus, Car, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAmbulances } from "../hooks/useAmbulances";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import type { AmbulanceType } from "../types";

const addAmbulanceSchema = z.object({
  name: z.string().min(3, "Le nom est requis (min 3 caractères)"),
  type: z.enum(["A", "B", "C"] as const),
  crew: z.string().min(2, "Au moins un membre d'équipage est requis"),
});

type AddAmbulanceFormValues = z.infer<typeof addAmbulanceSchema>;

interface AddAmbulanceDialogProps {
  onClose: () => void;
}

export const AddAmbulanceDialog = ({ onClose }: AddAmbulanceDialogProps) => {
  const { createAmbulance, isCreating } = useAmbulances();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddAmbulanceFormValues>({
    resolver: zodResolver(addAmbulanceSchema),
    defaultValues: {
      type: "A",
    },
  });

  const onSubmit = async (data: AddAmbulanceFormValues) => {
    try {
      // Parse crew members (comma-separated)
      const crew = data.crew
        .split(",")
        .map((member) => member.trim())
        .filter(Boolean);

      // Random location near Casablanca for demo
      const lat = 33.5731 + (Math.random() - 0.5) * 0.1;
      const lng = -7.5898 + (Math.random() - 0.5) * 0.1;

      await createAmbulance({
        name: data.name,
        type: data.type,
        lat,
        lng,
        crew,
      });

      reset();
      onClose();
    } catch (error) {
      console.error("Error creating ambulance:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Car className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Ajouter une ambulance
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Nom de l'ambulance *
            </label>
            <Input
              {...register("name")}
              placeholder="Ex: AMB-05"
              icon={Car}
              error={errors.name?.message}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Type *</label>
            <select
              {...register("type")}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition-colors focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option value="A">Type A - Ambulance médicale</option>
              <option value="B">Type B - Ambulance de transport</option>
              <option value="C">Type C - Ambulance légère</option>
            </select>
            {errors.type && (
              <p className="text-xs text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Équipage *
            </label>
            <Input
              {...register("crew")}
              placeholder="Ex: Ahmed, Sarah (séparés par des virgules)"
              icon={User}
              error={errors.crew?.message}
            />
            <p className="text-xs text-gray-500">
              Séparez les noms par des virgules
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={onClose}
              disabled={isCreating}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1"
              loading={isCreating}
              disabled={isCreating}
              icon={Plus}
            >
              Ajouter
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
