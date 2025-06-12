import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent } from "../components/ui/Card";
import type { UserLoginDTO, UserRegisterDTO } from "../types/User";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "GUEST">("STUDENT");

  const navigate = useNavigate();

  const handleLogin = async () => {
    const loginData: UserLoginDTO = {
      login: email, // ou username dependendo da lógica da API
      password,
    };

    console.log("Login DTO:", loginData);
    // await api.login(loginData);
    navigate("/quizzes");
  };

  const handleRegister = async () => {
    const registerData: UserRegisterDTO = {
      username,
      email,
      password,
      role,
    };

    console.log("Register DTO:", registerData);
    // await api.register(registerData);
    navigate("/quizzes");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <CardContent>
          <h1 className="text-2xl font-bold mb-4 text-center">
            {isLogin ? "Login" : "Criar Conta"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <Input
                  type="text"
                  placeholder="Nome de usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </>
            )}
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!isLogin && (
              <select
                className="w-full p-2 border rounded"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
              >
                <option value="STUDENT">Estudante</option>
                <option value="GUEST">Convidado</option>
              </select>
            )}
            <Button type="submit" className="w-full">
              {isLogin ? "Entrar" : "Registrar"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Não tem conta? Cadastre-se"
                : "Já tem conta? Faça login"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
