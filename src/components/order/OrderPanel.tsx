import { useEffect } from 'react'
import { OrderItem as OrderItemType } from '../../types'
import { OrderItem } from './OrderItem'

interface OrderPanelProps {
  isOpen: boolean
  items: OrderItemType[]
  mostrarPrecios: boolean
  totalPrice: number
  onClose: () => void
  onUpdateQuantity: (productoId: string, cantidad: number) => void
  onRemove: (productoId: string) => void
  onConfirm: () => void
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price)
}

export function OrderPanel({
  isOpen,
  items,
  mostrarPrecios,
  totalPrice,
  onClose,
  onUpdateQuantity,
  onRemove,
  onConfirm,
}: OrderPanelProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:max-w-sm z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎁</span>
            <h2 className="font-bold text-text text-lg">Mi pedido</h2>
            {items.length > 0 && (
              <span className="bg-primary text-white text-xs font-bold rounded-full px-2 py-0.5">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="font-semibold text-text mb-1">Tu pedido está vacío</h3>
              <p className="text-slate-400 text-sm">
                Explorá el catálogo y agregá los regalos que te gusten.
              </p>
            </div>
          ) : (
            <div className="py-2">
              {items.map((item) => (
                <OrderItem
                  key={item.producto.id}
                  item={item}
                  mostrarPrecios={mostrarPrecios}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemove}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-slate-100 space-y-3">
            {mostrarPrecios && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Total</span>
                <span className="text-xl font-bold text-primary">{formatPrice(totalPrice)}</span>
              </div>
            )}
            <button
              onClick={onConfirm}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-md text-base"
            >
              Confirmar pedido
            </button>
          </div>
        )}
      </div>
    </>
  )
}
