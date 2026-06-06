import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Producto } from '../types'

async function fetchProductosByCatalogo(catalogoId: string): Promise<Producto[]> {
  const { data, error } = await supabase
    .from('catalogo_productos')
    .select('producto_id, productos(*)')
    .eq('catalogo_id', catalogoId)

  if (error) throw error

  return (data ?? [])
    .map((row: any) => row.productos)
    .filter(Boolean)
    .filter((p: Producto) => p.activo)
}

export function useProducts(catalogoId: string | undefined) {
  return useQuery({
    queryKey: ['products', catalogoId],
    queryFn: () => fetchProductosByCatalogo(catalogoId!),
    enabled: !!catalogoId,
    staleTime: 5 * 60 * 1000,
  })
}
