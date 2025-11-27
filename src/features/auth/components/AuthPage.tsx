import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  if (isLogin) {
    return <LoginForm onSwitchToRegister={() => setIsLogin(false)} />;
  }

  return <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />;
};
