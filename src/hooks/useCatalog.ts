import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Empresa, Catalogo } from '../types'

async function fetchEmpresaByToken(token: string): Promise<Empresa | null> {
  const { data, error } = await supabase
    .from('empresas')
    .select('*')
    .eq('token_acceso', token)
    .maybeSingle()

  if (error) throw error
  return data
}

async function fetchCatalogoByEmpresa(empresaId: string): Promise<Catalogo | null> {
  const { data, error } = await supabase
    .from('catalogos')
    .select('*')
    .eq('empresa_id', empresaId)
    .eq('activo', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}

export function useCatalog(token: string | undefined) {
  const empresaQuery = useQuery({
    queryKey: ['empresa', token],
    queryFn: () => fetchEmpresaByToken(token!),
    enabled: !!token,
    retry: false,
  })

  const catalogoQuery = useQuery({
    queryKey: ['catalogo', empresaQuery.data?.id],
    queryFn: () => fetchCatalogoByEmpresa(empresaQuery.data!.id),
    enabled: !!empresaQuery.data?.id,
    retry: false,
  })

  return {
    empresa: empresaQuery.data ?? null,
    catalogo: catalogoQuery.data ?? null,
    isLoading: empresaQuery.isPending || (empresaQuery.data != null && catalogoQuery.isPending),
    isError: empresaQuery.isError || catalogoQuery.isError,
    notFound: empresaQuery.isSuccess && empresaQuery.data === null,
  }
}
