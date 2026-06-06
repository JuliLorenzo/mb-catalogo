import { useParams } from 'react-router-dom'

export function OrderConfirmedPage() {
  const { pedidoId } = useParams<{ pedidoId: string }>()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="text-6xl mb-4 animate-bounce">🎁</div>
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-text mb-2">¡Pedido enviado!</h1>
          <p className="text-slate-500 leading-relaxed mb-6">
            Recibimos tu pedido correctamente.
            Nos comunicaremos a la brevedad. ¡Gracias!
          </p>

          {pedidoId && (
            <p className="text-xs text-slate-300 mb-6 font-mono">
              Ref: {pedidoId.slice(0, 8).toUpperCase()}
            </p>
          )}

          <div className="bg-primary/5 rounded-xl px-4 py-3 mb-6">
            <p className="text-sm text-corporate font-medium">🏪 Mundo Barrilete</p>
            <p className="text-xs text-slate-400 mt-0.5">San Juan, Argentina</p>
          </div>

          <p className="text-slate-400 text-sm">
            ¿Tenés otra consulta? Escribinos a{' '}
            <a
              href="mailto:mundobarriletesj@gmail.com"
              className="text-primary font-medium hover:underline"
            >
              mundobarriletesj@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
