import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Siren, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { loginSchema, type LoginFormValues } from "../lib/validators";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
  const { login, isLoginLoading, loginError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
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
            <h1 className="text-2xl font-bold text-gray-900">ResQ Console</h1>
            <p className="text-gray-600 text-sm">
              Connectez-vous pour accéder au système de dispatch
            </p>
          </div>

          {/* Error Alert */}
          {loginError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                {...register("email")}
                type="email"
                placeholder="admin@resq.com"
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
            </div>{" "}
            <Button
              type="submit"
              className="w-full"
              loading={isLoginLoading}
              disabled={isLoginLoading}
            >
              Se connecter
            </Button>
          </form>

          {/* Switch to Register */}
          {onSwitchToRegister && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{" "}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-red-600 hover:text-red-500 font-medium"
                >
                  Créer un compte
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
