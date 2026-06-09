import { useState } from 'react'

interface EmployeeLoginProps {
  empresaNombre: string
  isLoading: boolean
  errorMessage: string | null
  onLogin: (nombreApellido: string, password: string) => void
}

export function EmployeeLogin({ empresaNombre, isLoading, errorMessage, onLogin }: EmployeeLoginProps) {
  const [nombre, setNombre] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim() || !password.trim()) return
    onLogin(nombre, password)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo + título */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/logo.jpeg"
            alt="Mundo Barrilete"
            className="h-36 w-36 object-contain mb-5"
          />
          <h1 className="text-4xl text-center text-zinc-800" style={{ fontFamily: "'Oswald', sans-serif" }}>
            MUNDO BARRILETE
          </h1>
          <p className="text-primary font-semibold text-base tracking-wide mt-2">
            Día del Niño 2026
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-5">
            <h2 className="text-lg font-bold text-text text-center">
              Elegí el regalo de tu/s hijo/s 🎁
            </h2>
            <p className="text-slate-500 text-sm text-center mt-1">{empresaNombre}</p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Tu nombre y apellido
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Juan Pérez"
                autoComplete="name"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresá la contraseña"
                autoComplete="current-password"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-slate-400"
              />
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !nombre.trim() || !password.trim()}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.98] shadow-md"
            >
              {isLoading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
