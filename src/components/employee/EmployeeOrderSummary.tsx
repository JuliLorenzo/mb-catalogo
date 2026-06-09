import { useState } from 'react'
import { OrderItem, Empresa, Catalogo, Empleado } from '../../types'
import { supabase } from '../../lib/supabase'
import { sendEmployeeOrderEmail } from '../../lib/resend'

interface EmployeeOrderSummaryProps {
  items: OrderItem[]
  empresa: Empresa
  catalogo: Catalogo
  empleado: Empleado
  onBack: () => void
  onSuccess: (pedidoId: string) => void
}

export function EmployeeOrderSummary({
  items,
  empresa,
  catalogo,
  empleado,
  onBack,
  onSuccess,
}: EmployeeOrderSummaryProps) {
  const [observaciones, setObservaciones] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0)

  async function handleSubmit() {
    setIsSubmitting(true)
    setError(null)

    try {
      // 1. Create pedido with empleado_id
      const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos')
        .insert({
          empresa_id: empresa.id,
          catalogo_id: catalogo.id,
          empleado_id: empleado.id,
          estado: 'pendiente',
          observaciones: observaciones.trim() || null,
        })
        .select()
        .single()

      if (pedidoError) throw pedidoError

      // 2. Create pedido_items
      const pedidoItems = items.map((item) => ({
        pedido_id: pedido.id,
        producto_id: item.producto.id,
        cantidad: item.cantidad,
      }))

      const { error: itemsError } = await supabase.from('pedido_items').insert(pedidoItems)
      if (itemsError) throw itemsError

      // 3. Mark empleado as done
      const { error: empError } = await supabase
        .from('empleados')
        .update({ pedido_realizado: true })
        .eq('id', empleado.id)

      if (empError) throw empError

      // 4. Send email (non-blocking)
      try {
        await sendEmployeeOrderEmail({ empresa, empleado, items, observaciones: observaciones.trim(), pedidoId: pedido.id })
      } catch (emailErr) {
        console.error('Email no enviado:', emailErr)
      }

      onSuccess(pedido.id)
    } catch (err: any) {
      setError('Hubo un problema al enviar el pedido. Por favor, intentá de nuevo.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-text mb-6 transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al catálogo
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-primary/5 to-secondary/5">
            <h1 className="text-2xl font-bold text-text">Resumen de tu selección</h1>
            <p className="text-slate-500 text-sm mt-1">
              {empleado.nombre_apellido} · {empresa.nombre} · {totalItems} {totalItems === 1 ? 'regalo' : 'regalos'}
            </p>
          </div>

          {/* Items */}
          <div className="divide-y divide-slate-100">
            {items.map((item) => {
              const foto = item.producto.fotos?.[0] ?? null
              return (
                <div key={item.producto.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
                    {foto ? (
                      <img src={foto} alt={item.producto.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🎁</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text text-sm line-clamp-1">{item.producto.nombre}</p>
                    <p className="text-slate-400 text-xs mt-0.5">Cantidad: {item.cantidad}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Observaciones */}
          <div className="px-6 py-5 border-t border-slate-100">
            <label className="block text-sm font-medium text-text mb-2">
              Observaciones{' '}
              <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="¿Algún comentario o aclaración para Mundo Barrilete?"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Submit */}
          <div className="px-6 pb-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all active:scale-[0.98] shadow-md text-base"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Enviando pedido...
                </span>
              ) : (
                'Confirmar mi selección 🎁'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
