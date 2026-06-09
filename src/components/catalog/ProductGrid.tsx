import { Producto } from '../../types'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  productos: Producto[]
  mostrarPrecios: boolean
  getItemQuantity: (id: string) => number
  remainingQuota?: number
  onProductClick: (producto: Producto) => void
  onAdd: (producto: Producto) => void
  onUpdateQuantity: (productoId: string, cantidad: number) => void
  isLoading: boolean
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 animate-pulse">
      <div className="aspect-square bg-slate-200" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
        <div className="h-4 bg-slate-200 rounded w-1/3" />
      </div>
    </div>
  )
}

export function ProductGrid({
  productos,
  mostrarPrecios,
  getItemQuantity,
  remainingQuota,
  onProductClick,
  onAdd,
  onUpdateQuantity,
  isLoading,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (productos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-text mb-2">No encontramos productos</h3>
        <p className="text-slate-400 text-sm max-w-xs">
          Probá con otros filtros o eliminá la búsqueda para ver todos los productos disponibles.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {productos.map((producto) => (
        <ProductCard
          key={producto.id}
          producto={producto}
          mostrarPrecios={mostrarPrecios}
          cantidad={getItemQuantity(producto.id)}
          remainingQuota={remainingQuota}
          onClick={() => onProductClick(producto)}
          onAdd={onAdd}
          onUpdateQuantity={onUpdateQuantity}
        />
      ))}
    </div>
  )
}
