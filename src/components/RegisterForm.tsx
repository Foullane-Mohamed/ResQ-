import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Siren, Mail, Lock, User as UserIcon, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import {
  registerSchema,
  type RegisterFormValues,
} from "../lib/validations/authValidation";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm = ({ onSwitchToLogin }: RegisterFormProps) => {
  const {
    register: registerUser,
    isRegisterLoading,
    registerError,
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "REGULATEUR",
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    const { confirmPassword, ...registerData } = data;
    registerUser(registerData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="p-3 bg-red-100 rounded-full">
                <Siren className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Créer un compte
            </h1>
            <p className="text-gray-600 text-sm">Rejoignez l'équipe ResQ</p>
          </div>

          {/* Error Alert */}
          {registerError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{registerError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <Input
                {...register("name")}
                type="text"
                placeholder="Votre nom complet"
                icon={UserIcon}
                error={errors.name?.message}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                {...register("email")}
                type="email"
                placeholder="votre.email@resq.com"
                icon={Mail}
                error={errors.email?.message}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <Input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                icon={Lock}
                error={errors.password?.message}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Confirmer le mot de passe
              </label>
              <Input
                {...register("confirmPassword")}
                type="password"
                placeholder="••••••••"
                icon={Lock}
                error={errors.confirmPassword?.message}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Rôle</label>
              <select
                {...register("role")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
              >
                <option value="REGULATEUR">Régulateur</option>
                <option value="CHEF_DE_PARC">Chef de Parc</option>
                <option value="ADMIN">Administrateur</option>
              </select>
              {errors.role?.message && (
                <p className="text-red-500 text-xs">{errors.role.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={isRegisterLoading}
              disabled={isRegisterLoading}
            >
              Créer le compte
            </Button>
          </form>

          {/* Switch to Login */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-red-600 hover:text-red-500 font-medium"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
