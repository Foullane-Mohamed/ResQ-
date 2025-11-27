import { z } from 'zod';

export const incidentSchema = z.object({
  type: z.string().min(3, { message: "Le type d'incident est requis (min 3 caractères)" }),
  address: z.string().min(5, { message: "L'adresse est requise (min 5 caractères)" }),
  severity: z.enum(['CRITICAL', 'HIGH', 'MODERATE', 'LOW'] as const, {
    error: () => ({ message: "Veuillez sélectionner une gravité valide" }),
  }),
  description: z.string().optional(),
});

export type IncidentFormValues = z.infer<typeof incidentSchema>;
