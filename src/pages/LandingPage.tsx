import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6">
        <div className="text-2xl font-bold text-base-content">StudAI</div>
        <div className="flex gap-6 items-center">
          <Link to="/home" className="hover:text-primary transition-colors px-4 py-2 text-base-content">
            Entrar
          </Link>
          <Link 
            to="/auth" 
            className="btn btn-primary px-4 py-2"
          >
            Começar
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Domine Seus Estudos com IA
        </h1>
        <p className="text-xl text-base-content/70 mb-8 max-w-2xl">
          Transforme sua experiência de aprendizado com questionários inteligentes, feedback personalizado 
          e assistência de estudo com IA. Tome controle da sua jornada educacional.
        </p>
        <div className="flex gap-4 mb-12">
          <Link 
            to="/auth" 
            className="btn btn-primary px-8 py-3 text-lg"
          >
            Começar a Estudar
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-8 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-base-content">Por que Escolher o StudAI?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card bg-base-100 shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="text-3xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold mb-3 text-base-content">Aprendizado com IA</h3>
            <p className="text-base-content/70">
              Algoritmos inteligentes se adaptam ao seu estilo de aprendizado e fornecem 
              recomendações de estudo personalizadas.
            </p>
          </div>
          <div className="card bg-base-100 shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-3 text-base-content">Análises Detalhadas</h3>
            <p className="text-base-content/70">
              Acompanhe seu progresso com análises abrangentes e insights de desempenho 
              para identificar áreas de melhoria.
            </p>
          </div>
          <div className="card bg-base-100 shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-3 text-base-content">Questionários Inteligentes</h3>
            <p className="text-base-content/70">
              Crie e participe de questionários inteligentes que se adaptam ao seu nível 
              de conhecimento e ritmo de aprendizado.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-8 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6 text-base-content">Pronto para Transformar Seu Aprendizado?</h2>
        <p className="text-base-content/70 mb-8 max-w-2xl mx-auto">
          Junte-se a milhares de estudantes que já estão usando o StudAI para melhorar sua 
          jornada educacional e alcançar melhores resultados.
        </p>
        <Link 
          to="/auth" 
          className="btn btn-primary px-8 py-4 text-lg transform hover:scale-105"
        >
          Comece Hoje Mesmo
        </Link>
      </div>

      {/* Footer */}
      <footer className="px-8 py-8 text-center text-base-content/60">
        <p>&copy; 2025 StudAI. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}

export default LandingPage
