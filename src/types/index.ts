export interface Producto {
  id: string
  nombre: string
  descripcion: string | null
  precio: number | null
  fotos: string[] | null
  edad_min: number | null
  edad_max: number | null
  sexo: 'nene' | 'nena' | 'unisex' | 'bebe'
  marca: string | null
  activo: boolean
  created_at: string
}

export interface Empresa {
  id: string
  nombre: string
  email_contacto: string | null
  mostrar_precios: boolean
  token_acceso: string
  created_at: string
}

export interface Catalogo {
  id: string
  empresa_id: string
  nombre: string
  activo: boolean
  created_at: string
}

export interface CatalogoProducto {
  id: string
  catalogo_id: string
  producto_id: string
}

export interface Pedido {
  id: string
  empresa_id: string
  catalogo_id: string
  estado: string
  observaciones: string | null
  created_at: string
}

export interface PedidoItem {
  id: string
  pedido_id: string
  producto_id: string
  cantidad: number
}

export interface OrderItem {
  producto: Producto
  cantidad: number
}

export type SexoFilter = 'todos' | 'nene' | 'nena' | 'unisex' | 'bebe'
export type EdadFilter = 'todos' | '0-2' | '3-5' | '6-8' | '9-12' | '12+'
export type SortOption = 'precio-asc' | 'precio-desc'
