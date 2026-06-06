
export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-text mb-2">Catálogo no encontrado</h1>
          <p className="text-slate-500 leading-relaxed mb-6">
            El link que usaste no es válido o ya no está disponible.
            Por favor, solicitá el link correcto a Mundo Barrilete.
          </p>

          <div className="bg-primary/5 rounded-xl px-4 py-3">
            <p className="text-sm text-corporate font-medium">🏪 Mundo Barrilete</p>
            <p className="text-xs text-slate-400 mt-0.5">San Juan, Argentina</p>
            <a
              href="mailto:mundobarriletesj@gmail.com"
              className="text-xs text-primary font-medium hover:underline mt-1 block"
            >
              mundobarriletesj@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
