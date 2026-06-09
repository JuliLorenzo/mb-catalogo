import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Producto } from '../../types'

interface ProductDetailProps {
  producto: Producto | null
  mostrarPrecios: boolean
  currentQuantity: number
  onClose: () => void
  onAdd: (producto: Producto, cantidad: number) => void
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
  return `${min} a ${max} años`
}

function formatPrice(price: number | null): string {
  if (price === null) return ''
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price)
}

export function ProductDetail({
  producto,
  mostrarPrecios,
  currentQuantity,
  onClose,
  onAdd,
  onUpdateQuantity,
}: ProductDetailProps) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const [localQty, setLocalQty] = useState(1)
  const [inputVal, setInputVal] = useState('1')
  const skipSyncRef = useRef(false)

  useEffect(() => {
    setPhotoIndex(0)
    const q = currentQuantity > 0 ? currentQuantity : 1
    setLocalQty(q)
    setInputVal(String(q))
  }, [producto, currentQuantity])

  useEffect(() => {
    if (skipSyncRef.current) { skipSyncRef.current = false; return }
    setInputVal(String(localQty))
  }, [localQty])

  function commitInput(raw: string) {
    const parsed = parseInt(raw, 10)
    const next = isNaN(parsed) || parsed < 1 ? 1 : parsed
    skipSyncRef.current = true
    setLocalQty(next)
    setInputVal(String(next))
  }

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (!producto) return
    const totalFotos = producto.fotos?.length ?? 0
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (document.activeElement?.tagName === 'INPUT') return
      if (e.key === 'ArrowLeft') setPhotoIndex(i => Math.max(0, i - 1))
      if (e.key === 'ArrowRight') setPhotoIndex(i => Math.min(totalFotos - 1, i + 1))
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [producto, onClose])

  if (!producto) return null

  const fotos = producto.fotos?.length ? producto.fotos : []
  const ageLabel = formatAge(producto.edad_min, producto.edad_max)
  const alreadyInOrder = currentQuantity > 0

  function handleConfirm() {
    if (alreadyInOrder) {
      onUpdateQuantity(producto!.id, localQty)
    } else {
      onAdd(producto!, localQty)
    }
    onClose()
  }

  function prevPhoto() { setPhotoIndex(i => Math.max(0, i - 1)) }
  function nextPhoto() { setPhotoIndex(i => Math.min(fotos.length - 1, i + 1)) }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close button */}
        <div className="flex justify-end p-4 pb-0">
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

        <div className="px-5 pb-6 space-y-4">
          {/* Photo gallery */}
          {fotos.length > 0 ? (
            <div className="space-y-2">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50">
                <img
                  src={fotos[photoIndex]}
                  alt={producto.nombre}
                  className="w-full h-full object-contain"
                />
                {fotos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      disabled={photoIndex === 0}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 disabled:opacity-20 text-white rounded-full flex items-center justify-center transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextPhoto}
                      disabled={photoIndex === fotos.length - 1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 disabled:opacity-20 text-white rounded-full flex items-center justify-center transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    {/* Dots */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {fotos.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPhotoIndex(i)}
                          className={`w-2 h-2 rounded-full transition-all ${i === photoIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {fotos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {fotos.map((foto, i) => (
                    <button
                      key={i}
                      onClick={() => setPhotoIndex(i)}
                      className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        i === photoIndex ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img src={foto} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-square rounded-xl bg-slate-50 flex items-center justify-center text-6xl">
              🎁
            </div>
          )}

          {/* Info */}
          <div>
            <h2 className="text-xl font-bold text-text mb-2">{producto.nombre}</h2>

            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`text-sm px-3 py-1 rounded-full font-medium ${SEXO_COLORS[producto.sexo]}`}>
                {SEXO_LABELS[producto.sexo]}
              </span>
              {ageLabel && (
                <span className="text-sm px-3 py-1 rounded-full font-medium bg-slate-100 text-slate-600">
                  {ageLabel}
                </span>
              )}
              {producto.marca && (
                <span className="text-sm px-3 py-1 rounded-full font-medium bg-slate-100 text-slate-600">
                  {producto.marca}
                </span>
              )}
            </div>

            {producto.descripcion && (
              <p className="text-slate-600 text-sm leading-relaxed">{producto.descripcion}</p>
            )}

            {mostrarPrecios && (
              producto.precio !== null
                ? <p className="text-2xl font-bold text-primary mt-3">{formatPrice(producto.precio)}</p>
                : <p className="text-base text-slate-400 font-medium mt-3">Consultar precio</p>
            )}
          </div>

          {/* Quantity + action */}
          <div className="border-t border-slate-100 pt-4 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600">Cantidad:</span>
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1">
                <button
                  onClick={() => setLocalQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  onBlur={(e) => commitInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
                  className="w-10 text-center font-semibold text-text bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onClick={() => setLocalQty((q) => q + 1)}
                  className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.98] shadow-md"
            >
              {alreadyInOrder ? 'Actualizar en mi pedido' : 'Agregar a mi pedido'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
