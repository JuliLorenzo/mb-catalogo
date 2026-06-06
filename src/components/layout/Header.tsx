import { Empresa } from '../../types'

interface HeaderProps {
  empresa: Empresa | null
  totalItems: number
  onOpenOrder: () => void
}

export function Header({ empresa, totalItems, onOpenOrder }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/logo.jpeg"
            alt="Mundo Barrilete"
            className="h-10 w-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs text-slate-400 leading-none mb-0.5">Catálogo digital</p>
            <h1 className="font-bold text-text text-sm sm:text-base leading-tight truncate">
              {empresa ? empresa.nombre : 'Cargando...'}
            </h1>
          </div>
        </div>

        <button
          onClick={onOpenOrder}
          className="relative flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-2 rounded-full transition-all shadow-md hover:shadow-lg active:scale-95 flex-shrink-0"
          aria-label="Ver mi pedido"
        >
          <span className="text-lg leading-none">🎁</span>
          <span className="hidden sm:inline text-sm">Mi pedido</span>
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-secondary text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
