import { useState, useCallback } from 'react'
import { Producto, OrderItem } from '../types'

export function useOrder() {
  const [items, setItems] = useState<OrderItem[]>([])

  const addItem = useCallback((producto: Producto, cantidad: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.producto.id === producto.id)
      if (existing) {
        return prev.map((i) =>
          i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i
        )
      }
      return [...prev, { producto, cantidad }]
    })
  }, [])

  const updateQuantity = useCallback((productoId: string, cantidad: number) => {
    if (cantidad <= 0) {
      setItems((prev) => prev.filter((i) => i.producto.id !== productoId))
    } else {
      setItems((prev) =>
        prev.map((i) => (i.producto.id === productoId ? { ...i, cantidad } : i))
      )
    }
  }, [])

  const removeItem = useCallback((productoId: string) => {
    setItems((prev) => prev.filter((i) => i.producto.id !== productoId))
  }, [])

  const clearOrder = useCallback(() => {
    setItems([])
  }, [])

  const getItemQuantity = useCallback(
    (productoId: string): number => {
      return items.find((i) => i.producto.id === productoId)?.cantidad ?? 0
    },
    [items]
  )

  const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.producto.precio * i.cantidad, 0)

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearOrder,
    getItemQuantity,
    totalItems,
    totalPrice,
  }
}
