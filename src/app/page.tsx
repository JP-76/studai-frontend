'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);

  const router = useRouter();  
  const handleQuizNavigation = () => {
    router.push(`/quiz`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      // Handle login logic here
      const loginData = {
        username,
        password
      };

      try {
        const response = await fetch('http://localhost:5000/api/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginData)
        });

        const data = await response.text();
        console.log(data);

        if (response.ok) {
          // Set the JWT in a cookie
          document.cookie = `token=${data}; path=/;`;
          console.log('Login successful:', data);
          handleQuizNavigation();
        } else {
          console.error('Login failed:', data);
          alert('Login failed: ' + data);
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('Error during login');
      }

      

    } else {
      // Registro de usuário
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      const userData = {
        username,
        email,
        password
      };

      try {
        const response = await fetch('http://localhost:5000/api/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });

        const data = await response.text();

        if (response.ok) {
          alert('Cadastro realizado com sucesso!');
          console.log('Cadastro realizado com sucesso!:', data);
          setIsLogin(true);
        } else {
          console.error('Registration failed:', data);
          alert('Registration failed: ' + data);
        }
      } catch (error) {
        console.error('Error registering user:', error);
        alert('Error registering user');
      }
    }
  };

  const handleTermsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTermsPopup(true);
  };

  const handleClosePopup = () => {
    setShowTermsPopup(false);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#12121B] overflow-hidden relative">
      <div className={`absolute top-0 bottom-0 left-0 right-0 flex transition-transform duration-500 ${isLogin ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col items-center justify-center w-1/2 h-[85%] p-8 m-8 bg-[#12121B]">
          <h1 className="text-5xl text-white mb-8 self-start">Entrar</h1>
          <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
            <input
              type="text"
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-6 px-6 py-3 w-full rounded-lg bg-[#222233] text-white"
            />
            <div className="relative w-full mb-6">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-6 py-3 w-full rounded-lg bg-[#222233] text-white"
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img src={showPassword ? "/eyehidden.svg" : "/eye.svg"} alt="Toggle Password Visibility" className="h-6 w-6" />
              </span>
            </div>
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="rememberPassword"
                checked={rememberPassword}
                onChange={(e) => setRememberPassword(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="rememberPassword" className="text-white text-sm cursor-pointer">Lembrar minha senha</label>
            </div>
            <button type="submit" className="px-6 py-3 text-white bg-[#222233] rounded-lg w-1/2 hover:bg-[#333344]">
              Entrar
            </button>
          </form>
        </div>
        <div className="flex flex-col items-center justify-between w-1/2 h-[85%] p-8 m-8 bg-[#222233] rounded-lg">
          <button onClick={() => setIsLogin(false)} className="px-6 py-3 text-white bg-[#12121B] rounded-lg mt-4 mr-auto hover:bg-[#333344]">
            &larr; Registrar
          </button>
          <img src="/StudaiLogo.png" alt="Studai Logo" className="h-37 w-65 mb-6 mt-6" />
          <p className="text-white text-lg">Bem vindo de volta!</p>
        </div>
      </div>
      <div className={`absolute top-0 bottom-0 left-0 right-0 flex transition-transform duration-500 ${isLogin ? 'translate-x-full' : 'translate-x-0'}`}>
        <div className="flex flex-col items-center justify-between w-1/2 h-[85%] p-8 m-8 bg-[#222233] rounded-lg">
          <button onClick={() => setIsLogin(true)} className="px-6 py-3 text-white bg-[#12121B] rounded-lg mt-4 ml-auto hover:bg-[#333344]">
            Entrar &rarr;
          </button>
          <img src="/StudaiLogo.png" alt="Studai Logo" className="h-37 w-65 mb-6 mt-6" />
          <p className="text-white text-lg">Junte-se a nós!</p>
        </div>
        <div className="flex flex-col items-center justify-center w-1/2 h-[85%] p-8 m-8 bg-[#12121B]">
          <h1 className="text-5xl text-white mb-8 text-center">Criar uma conta</h1>
          <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-6 px-6 py-3 w-full rounded-lg bg-[#222233] text-white"
            />
            <input
              type="text"
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-6 px-6 py-3 w-full rounded-lg bg-[#222233] text-white"
            />
            <div className="relative w-full mb-6">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-6 py-3 w-full rounded-lg bg-[#222233] text-white"
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img src={showPassword ? "/eyehidden.svg" : "/eye.svg"} alt="Toggle Password Visibility" className="h-6 w-6" />
              </span>
            </div>
            <div className="relative w-full mb-6">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar Senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="px-6 py-3 w-full rounded-lg bg-[#222233] text-white"
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <img src={showConfirmPassword ? "/eyehidden.svg" : "/eye.svg"} alt="Toggle Password Visibility" className="h-6 w-6" />
              </span>
            </div>
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="acceptTerms" className="text-white text-sm cursor-pointer">
                Eu li e aceito os <span className="underline text-blue-500 hover:text-blue-700 cursor-pointer" onClick={handleTermsClick}>termos de uso</span>.
              </label>
            </div>
            <button type="submit" className="px-6 py-3 text-white bg-[#222233] rounded-lg w-1/2 hover:bg-[#333344]">
              Criar a conta
            </button>
          </form>
        </div>
      </div>
      {showTermsPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleClosePopup}>
          <div className="bg-white p-8 rounded-lg max-w-lg mx-auto text-black relative" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Termos de Uso</h2>
            <p className="mb-4">Isenção de Responsabilidade sobre Quizzes de IA de Terceiros</p>
            <p className="mb-4">Nosso serviço não se responsabiliza pelo conteúdo, precisão ou consequências dos quizzes gerados por inteligência artificial de terceiros. O uso desses quizzes é de total responsabilidade do usuário.</p>
            <p className="mb-4">Uso do Serviço</p>
            <p className="mb-4">Ao utilizar nossa plataforma, você concorda que qualquer interação com quizzes criados por IA de terceiros será feita por sua conta e risco. Não garantimos a qualidade, veracidade ou segurança dessas informações.</p>
            <p className="mb-4">Alterações nos Termos</p>
            <p className="mb-4">Reservamo-nos o direito de modificar estes termos a qualquer momento. O uso contínuo do serviço após alterações indica sua aceitação das novas condições.</p>
            <button className="absolute top-2 right-2 text-black" onClick={handleClosePopup}>X</button>
          </div>
        </div>
      )}
    </main>
  );
}