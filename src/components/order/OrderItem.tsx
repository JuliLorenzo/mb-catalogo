import { OrderItem as OrderItemType } from '../../types'

interface OrderItemProps {
  item: OrderItemType
  mostrarPrecios: boolean
  onUpdateQuantity: (productoId: string, cantidad: number) => void
  onRemove: (productoId: string) => void
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price)
}


export function OrderItem({ item, mostrarPrecios, onUpdateQuantity, onRemove }: OrderItemProps) {
  const foto = item.producto.fotos?.[0] ?? null

  return (
    <div className="flex gap-3 items-start py-3 border-b border-slate-100 last:border-0">
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
        {foto ? (
          <img src={foto} alt={item.producto.nombre} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🎁</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text leading-tight line-clamp-2 mb-1.5">
          {item.producto.nombre}
        </p>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-0.5">
            <button
              onClick={() => onUpdateQuantity(item.producto.id, item.cantidad - 1)}
              className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:bg-white hover:text-text transition-colors font-bold text-sm"
            >
              −
            </button>
            <span className="w-6 text-center text-sm font-semibold">{item.cantidad}</span>
            <button
              onClick={() => onUpdateQuantity(item.producto.id, item.cantidad + 1)}
              className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:bg-white hover:text-text transition-colors font-bold text-sm"
            >
              +
            </button>
          </div>

          {mostrarPrecios && (
            item.producto.precio !== null
              ? <span className="text-sm font-bold text-primary ml-auto">
                  {formatPrice(item.producto.precio * item.cantidad)}
                </span>
              : <span className="text-xs text-slate-400 font-medium ml-auto">Consultar precio</span>
          )}
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(item.producto.id)}
        className="w-7 h-7 flex items-center justify-center rounded-full text-slate-300 hover:text-secondary hover:bg-pink-50 transition-colors flex-shrink-0"
        aria-label="Eliminar"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
