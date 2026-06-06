import { Producto } from '../../types'

interface ProductCardProps {
  producto: Producto
  mostrarPrecios: boolean
  cantidad: number
  onClick: () => void
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

export function ProductCard({ producto, mostrarPrecios, cantidad, onClick }: ProductCardProps) {
  const foto = producto.fotos?.[0] ?? null
  const ageLabel = formatAge(producto.edad_min, producto.edad_max)

  return (
    <button
      onClick={onClick}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md hover:border-primary/20 transition-all duration-200 text-left w-full active:scale-[0.98]"
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
      <div className="p-3">
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
          <p className="font-bold text-primary text-base">{formatPrice(producto.precio)}</p>
        )}
      </div>
    </button>
  )
}
