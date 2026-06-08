import { useState, useEffect } from 'react'
import { Producto } from '../../types'

interface ProductCardProps {
  producto: Producto
  mostrarPrecios: boolean
  cantidad: number
  onClick: () => void
  onAdd: (producto: Producto) => void
  onUpdateQuantity: (productoId: string, cantidad: number) => void
}

const SEXO_LABELS: Record<string, string> = {
  nene: 'Nene',
  nena: 'Nena',
  unisex: 'Unisex',
  bebe: 'Bebé',
}

const SEXO_COLORS: Record<string, string> = {
  nene: 'bg-blue-100 text-blue-700',
  nena: 'bg-pink-100 text-pink-700',
  unisex: 'bg-purple-100 text-purple-700',
  bebe: 'bg-yellow-100 text-yellow-700',
}

function formatAge(min: number | null, max: number | null): string {
  if (min === null) return ''
  if (max === null) return `+${min} años`
  return `${min}–${max} años`
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price)
}

export function ProductCard({ producto, mostrarPrecios, cantidad, onClick, onAdd, onUpdateQuantity }: ProductCardProps) {
  const foto = producto.fotos?.[0] ?? null
  const ageLabel = formatAge(producto.edad_min, producto.edad_max)
  const [inputVal, setInputVal] = useState(String(cantidad))

  useEffect(() => {
    setInputVal(String(cantidad))
  }, [cantidad])

  function commitInput(raw: string) {
    const parsed = parseInt(raw, 10)
    const next = isNaN(parsed) || parsed < 0 ? 0 : parsed
    onUpdateQuantity(producto.id, next)
  }

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md hover:border-primary/20 transition-all duration-200 flex flex-col">
      {/* Foto + info — clickeable para abrir detalle */}
      <button
        onClick={onClick}
        className="text-left w-full flex-1 active:scale-[0.98] transition-transform"
      >
        {/* Foto */}
        <div className="relative aspect-square overflow-hidden bg-slate-50">
          {foto ? (
            <img
              src={foto}
              alt={producto.nombre}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">🎁</div>
          )}

          {/* Badge cantidad */}
          {cantidad > 0 && (
            <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow">
              {cantidad}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 pb-2">
          <h3 className="font-semibold text-text text-sm leading-tight mb-2 line-clamp-2">
            {producto.nombre}
          </h3>

          <div className="flex flex-wrap gap-1 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SEXO_COLORS[producto.sexo]}`}>
              {SEXO_LABELS[producto.sexo]}
            </span>
            {ageLabel && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600">
                {ageLabel}
              </span>
            )}
          </div>

          {mostrarPrecios && (
            <p className="font-bold text-primary text-base text-center">{formatPrice(producto.precio)}</p>
          )}
        </div>
      </button>

      {/* Acción */}
      <div className="px-3 pb-3">
        {cantidad === 0 ? (
          <button
            onClick={() => onAdd(producto)}
            className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white text-sm font-semibold py-1.5 rounded-xl transition-all border border-primary/20 hover:border-primary"
          >
            Agregar
          </button>
        ) : (
          <div className="flex items-center justify-between bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => onUpdateQuantity(producto.id, cantidad - 1)}
              className="w-9 h-8 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all font-bold text-lg"
            >
              −
            </button>
            <input
              type="number"
              min={0}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onFocus={(e) => e.target.select()}
              onBlur={(e) => commitInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
              className="w-10 text-center text-sm font-bold text-text bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={() => onUpdateQuantity(producto.id, cantidad + 1)}
              className="w-9 h-8 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all font-bold text-lg"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
