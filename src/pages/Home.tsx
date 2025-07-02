import { useState } from 'react'
import reactLogo from '/react.svg'
import viteLogo from '/vite.svg'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-[#242424] text-white flex flex-col items-center justify-center px-8 py-16 text-center font-sans">
      <div className="max-w-5xl w-full">
        <div className="flex justify-center items-center gap-8 mb-6">
          <a
            href="https://vite.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:drop-shadow-vite transition-all"
          >
            <img
              src={viteLogo}
              alt="Vite logo"
              className="h-24 p-6 transition-all"
            />
          </a>
          <a
            href="https://react.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:drop-shadow-react transition-all"
          >
            <img
              src={reactLogo}
              alt="React logo"
              className="h-24 p-6 animate-logo-spin"
            />
          </a>
        </div>

        <h1 className="text-5xl font-bold mb-8">Vite + React</h1>

        <div className="bg-[#1a1a1a] p-8 rounded-xl shadow-md">
          <button
            className="bg-[#1a1a1a] border border-transparent hover:border-indigo-400 text-white font-medium px-5 py-2 rounded-lg transition-colors"
            onClick={() => setCount((count) => count + 1)}
          >
            count is {count}
          </button>
          <p className="mt-6 text-gray-400">
            Edit <code className="bg-gray-800 px-2 py-1 rounded">src/App.tsx</code> and save to test HMR
          </p>
        </div>

        <p className="mt-8 text-gray-400 text-sm">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  )
}

export default Home
