import { Empresa } from '../../types'

interface HeaderProps {
  empresa: Empresa | null
  totalItems: number
  onOpenOrder: () => void
}

export function Header({ empresa: _empresa, totalItems, onOpenOrder }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-28 flex items-center justify-between gap-4">

        {/* Marca */}
        <div className="flex items-center gap-4">
          <img
            src="/logo.jpeg"
            alt="Mundo Barrilete"
            className="h-20 w-20 rounded-2xl object-cover flex-shrink-0 shadow-sm"
          />
          <div>
            <h1 className="font-extrabold text-text text-2xl sm:text-3xl tracking-tight leading-tight">
              MUNDO BARRILETE
            </h1>
            <p className="text-primary font-semibold text-sm sm:text-base tracking-wide mt-0.5">
              Día del Niño 2026
            </p>
          </div>
        </div>

        {/* Botón pedido */}
        <button
          onClick={onOpenOrder}
          className="relative flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg active:scale-95 flex-shrink-0"
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
