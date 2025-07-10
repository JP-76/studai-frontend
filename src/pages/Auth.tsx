import { useState } from "react";
import {
  IoPersonAddOutline,
  IoLogInOutline,
  IoPerson,
  IoLockClosed,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";

import type { LoginRequest } from "../types/login-request";
import type { RegisterRequest } from "../types/register-request";

import api from "../lib/axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showTerms, setShowTerms] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loginUserOrEmail, setLoginUserOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [usernameTouched, setUsernameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from =
    location.state &&
    "from" in location.state &&
    location.state.from &&
    "pathname" in location.state.from
      ? location.state.from.pathname
      : "/home";

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    if (value.trim().length > 0) setUsernameTouched(true);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value.trim().length > 0) setEmailTouched(true);
  };

  const validatePassword = (value: string) => ({
    length: value.length >= 8,
    number: /\d/.test(value),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    uppercase: /[A-Z]/.test(value),
  });

  const validateEmail = (value: string) => {
    if (!value) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validateUsername = (value: string) => {
    if (!value) return false;
    return value.trim().length > 3;
  };

  const pwd = validatePassword(password);
  const allValid = Object.values(pwd).every(Boolean);
  const isUsernameValid = validateUsername(username);
  const isEmailValid = validateEmail(email);

  // Clear all fields when switching form
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setUsername("");
    setEmail("");
    setLoginUserOrEmail("");
    setPassword("");
    setShowPassword(false);
    setAcceptedTerms(false);
    setUsernameTouched(false);
    setEmailTouched(false);
  };

  const isLoginEnabled =
    loginUserOrEmail.trim().length > 0 && password.trim().length > 0;
  const isRegisterEnabled =
    isUsernameValid && isEmailValid && allValid && acceptedTerms;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      login({ login: loginUserOrEmail, password: password });
    } else {
      register({
        username: username,
        email: email,
        password: password,
        role: "STUDENT", // Default role, can be changed later
      });
    }
  };

  const login = async (body: LoginRequest) => {
    try {
      const response = await api.post("/v1/login", body);

      if (response.status === 200) {
        const token: string = response.data;

        // Store the token in cookies using js-cookie
        // Set the cookie with a 7-day expiration, sameSite, and secure attributes
        Cookies.set("auth_token", token, {
          expires: 7,
          sameSite: "Strict",
          secure: window.location.protocol === "https:",
        });

        toast.success("Login realizado com sucesso!");
        navigate(from, { replace: true });
      } else {
        toast.error("Credenciais inválidas. Tente novamente.");
      }
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as { response?: { status: number } };
        if (axiosError.response?.status === 401) {
          toast.error("Nome de usuário ou senha incorretos.");
        } else {
          toast.error("Algo deu errado. Tente novamente mais tarde.");
        }
      } else {
        toast.error("Algo deu errado. Tente novamente mais tarde.");
      }
    }
  };

  const register = async (body: RegisterRequest) => {
    try {
      const response = await api.post("/v1/register", body);

      if (response.status === 200) {
        toast.success(
          "Cadastro realizado com sucesso! Agora você pode fazer login."
        );
        toggleForm();
      } else {
        toast.error("Falha no cadastro. Tente novamente.");
      }
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as { response?: { status: number } };
        if (axiosError.response?.status === 400) {
          toast.error(
            "Dados de cadastro inválidos. Verifique suas informações."
          );
        } else {
          toast.error("Algo deu errado. Tente novamente mais tarde.");
        }
      } else {
        toast.error("Algo deu errado. Tente novamente mais tarde.");
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
        <div className="border-b border-dashed border-base-300">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              {isLogin ? (
                <>
                  <IoLogInOutline className="text-xl" />
                  Bem-vindo de volta
                </>
              ) : (
                <>
                  <IoPersonAddOutline className="text-xl" />
                  Criar nova conta
                </>
              )}
            </div>
            <button onClick={toggleForm} className="link text-xs">
              {isLogin ? "Cadastrar" : "Entrar"}
            </button>
          </div>
        </div>

        <form className="card-body gap-4" onSubmit={handleFormSubmit}>
          {!isLogin ? (
            <p className="text-xs opacity-60">
              O cadastro é gratuito e leva apenas um minuto
            </p>
          ) : (
            <p className="text-xs opacity-60">
              Por favor, insira suas credenciais para entrar
            </p>
          )}

          {isLogin ? (
            <label className="input input-bordered flex items-center gap-2 w-full">
              <IoPerson className="opacity-70" />
              <input
                type="text"
                className="grow"
                placeholder="Nome de usuário ou Email"
                value={loginUserOrEmail}
                onChange={(e) => setLoginUserOrEmail(e.target.value)}
              />
            </label>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <label className="input input-bordered flex items-center gap-2 w-full">
                  <IoPerson className="opacity-70" />
                  <input
                    type="text"
                    className="grow"
                    placeholder="Nome de usuário"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                  />
                </label>
                {usernameTouched && !isUsernameValid && (
                  <span className="text-error text-xs">
                    Nome de usuário deve ter mais de 3 caracteres
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="input input-bordered flex items-center gap-2 w-full">
                  <IoPerson className="opacity-70" />
                  <input
                    type="email"
                    className="grow"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                  />
                </label>
                {emailTouched && !isEmailValid && (
                  <span className="text-error text-xs">
                    Por favor, insira um endereço de email válido
                  </span>
                )}
              </div>
            </>
          )}

          <div className="flex flex-col gap-1 relative">
            <label className="input input-bordered flex items-center gap-2 w-full">
              <IoLockClosed className="opacity-70" />
              <input
                type={showPassword ? "text" : "password"}
                className="grow w-full"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <IoEyeOffOutline className="text-lg opacity-70" />
                ) : (
                  <IoEyeOutline className="text-lg opacity-70" />
                )}
              </button>
            </label>

            {!isLogin && (
              <div className="text-base-content/60 px-1 text-[0.6875rem] grid grid-cols-2 flex-wrap">
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span
                    className={`status inline-block ${
                      pwd.uppercase ? "status-success" : "status-error"
                    }`}
                  />
                  Pelo menos uma letra maiúscula
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span
                    className={`status inline-block ${
                      pwd.special ? "status-success" : "status-error"
                    }`}
                  />
                  Pelo menos um caractere especial
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span
                    className={`status inline-block ${
                      pwd.number ? "status-success" : "status-error"
                    }`}
                  />
                  Pelo menos um número
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span
                    className={`status inline-block ${
                      pwd.length ? "status-success" : "status-error"
                    }`}
                  />
                  Pelo menos 8 caracteres
                </div>
              </div>
            )}
          </div>

          {!isLogin && (
            <label className="text-base-content/60 flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                className="toggle toggle-xs toggle-primary"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <span>
                Aceito os{" "}
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="link link-hover inline underline"
                >
                  Termos de Serviço
                </button>
              </span>
            </label>
          )}

          <div className="card-actions mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLogin ? !isLoginEnabled : !isRegisterEnabled}
            >
              {isLogin ? "Entrar" : "Cadastrar"}
            </button>
          </div>
        </form>

        {/* Terms Modal */}
        {showTerms && (
          <dialog open className="modal modal-open">
            <div className="modal-box max-w-6xl max-h-11/12 m-16">
              <h1 className="text-3xl font-bold mb-6">Termos de Serviço</h1>
              <p className="text-sm text-gray-500 mb-8">
                Última atualização: 3 de julho de 2025
              </p>

              <section className="space-y-6">
                <p>
                  Bem-vindo ao <strong>StudAI</strong> — uma plataforma que usa
                  inteligência artificial para ajudar usuários a gerar quizzes
                  para fins educacionais e de autoavaliação.
                </p>
                <p>
                  Ao acessar ou usar o StudAI, você concorda em estar vinculado
                  a estes Termos de Serviço. Se você não concorda com estes
                  termos, por favor não use nossos serviços.
                </p>

                <div>
                  <h2 className="text-xl font-semibold mt-8 mb-2">
                    1. Uso do Serviço
                  </h2>
                  <p>
                    O StudAI fornece serviços de geração de quizzes alimentados
                    por inteligência artificial. Você pode usar a plataforma
                    para criar, visualizar e interagir com quizzes para uso
                    pessoal, educacional ou não comercial.
                  </p>
                  <p>
                    Você concorda em não usar o serviço para fins ilegais,
                    prejudiciais ou abusivos.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mt-8 mb-2">
                    2. Isenção de Responsabilidade sobre Conteúdo Gerado por IA
                  </h2>
                  <p>
                    Os quizzes, respostas e explicações gerados pelo StudAI são
                    produzidos por inteligência artificial. Embora nos
                    esforcemos para garantir precisão e utilidade, o conteúdo
                    pode às vezes ser:
                  </p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Incorreto,</li>
                    <li>Enganoso,</li>
                    <li>Desatualizado,</li>
                    <li>
                      Ou inadequado para suas necessidades educacionais
                      específicas.
                    </li>
                  </ul>
                  <p className="mt-2">
                    <strong>Você é o único responsável</strong> por verificar a
                    precisão e adequação do conteúdo antes de usá-lo em qualquer
                    contexto educacional ou profissional.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mt-8 mb-2">
                    3. Nenhuma Garantia de Precisão
                  </h2>
                  <p>
                    Não garantimos a correção, completude ou confiabilidade de
                    qualquer conteúdo gerado por IA. O StudAI e seus
                    colaboradores não serão responsabilizados por quaisquer
                    erros ou decisões tomadas com base nas informações
                    fornecidas pela plataforma.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mt-8 mb-2">
                    4. Contas de Usuário
                  </h2>
                  <p>
                    Para acessar certas funcionalidades, você pode precisar se
                    registrar e criar uma conta. Você é responsável por manter a
                    confidencialidade de suas credenciais e por qualquer
                    atividade sob sua conta.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mt-8 mb-2">
                    5. Propriedade Intelectual
                  </h2>
                  <p>
                    Todo conteúdo original e software fornecido pelo StudAI,
                    excluindo conteúdo gerado por IA derivado de entrada do
                    usuário, é propriedade da plataforma e seus desenvolvedores.
                    Você não pode copiar, reproduzir ou redistribuir qualquer
                    parte do serviço sem permissão explícita.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mt-8 mb-2">
                    6. Alterações nos Termos
                  </h2>
                  <p>
                    Podemos atualizar estes Termos de tempos em tempos. O uso
                    continuado do StudAI após as alterações constitui sua
                    aceitação dos novos Termos. Você é encorajado a revisá-los
                    periodicamente.
                  </p>
                </div>
              </section>
              <div className="modal-action">
                <button className="btn" onClick={() => setShowTerms(false)}>
                  Fechar
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </main>
  );
};

export default AuthPage;
