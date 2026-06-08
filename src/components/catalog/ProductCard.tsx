import React, { useState, useEffect } from 'react'
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
  const fotos = producto.fotos ?? []
  const [photoIndex, setPhotoIndex] = useState(0)
  const [inputVal, setInputVal] = useState(String(cantidad))
  const ageLabel = formatAge(producto.edad_min, producto.edad_max)

  useEffect(() => {
    setInputVal(String(cantidad))
  }, [cantidad])

  useEffect(() => {
    setPhotoIndex(0)
  }, [producto.id])

  function commitInput(raw: string) {
    const parsed = parseInt(raw, 10)
    const next = isNaN(parsed) || parsed < 0 ? 0 : parsed
    onUpdateQuantity(producto.id, next)
  }

  function prevPhoto(e: React.MouseEvent) {
    e.stopPropagation()
    setPhotoIndex(i => Math.max(0, i - 1))
  }

  function nextPhoto(e: React.MouseEvent) {
    e.stopPropagation()
    setPhotoIndex(i => Math.min(fotos.length - 1, i + 1))
  }

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md hover:border-primary/20 transition-all duration-200 flex flex-col">

      {/* Imagen — click abre detalle, flechas navegan */}
      <div
        className="relative aspect-square overflow-hidden bg-slate-50 cursor-pointer"
        onClick={onClick}
      >
        {fotos.length > 0 ? (
          <img
            src={fotos[photoIndex]}
            alt={producto.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🎁</div>
        )}

        {/* Badge cantidad */}
        {cantidad > 0 && (
          <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow z-10">
            {cantidad}
          </div>
        )}

        {/* Flechas carrusel */}
        {fotos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              disabled={photoIndex === 0}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 hover:bg-black/60 disabled:opacity-0 text-white rounded-full flex items-center justify-center transition-all z-10 opacity-0 group-hover:opacity-100"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextPhoto}
              disabled={photoIndex === fotos.length - 1}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 hover:bg-black/60 disabled:opacity-0 text-white rounded-full flex items-center justify-center transition-all z-10 opacity-0 group-hover:opacity-100"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {/* Dots */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {fotos.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setPhotoIndex(i) }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === photoIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Info — click abre detalle */}
      <div className="p-3 pb-2 cursor-pointer flex-1" onClick={onClick}>
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
