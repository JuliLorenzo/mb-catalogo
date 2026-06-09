import { useState, useMemo, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useCatalog } from '../hooks/useCatalog'
import { useProducts } from '../hooks/useProducts'
import { useOrder } from '../hooks/useOrder'
import { useEmployeeAuth } from '../hooks/useEmployeeAuth'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { SearchBar } from '../components/catalog/SearchBar'
import { FilterBar } from '../components/catalog/FilterBar'
import { ProductGrid } from '../components/catalog/ProductGrid'
import { ProductDetail } from '../components/catalog/ProductDetail'
import { OrderPanel } from '../components/order/OrderPanel'
import { EmployeeLogin } from '../components/employee/EmployeeLogin'
import { EmployeeOrderSummary } from '../components/employee/EmployeeOrderSummary'
import { NotFoundPage } from './NotFoundPage'
import { Producto, SexoFilter, EdadFilter, SortOption } from '../types'

type PageStep = 'login' | 'catalog' | 'summary'

function matchesEdad(producto: Producto, filter: EdadFilter): boolean {
  if (filter === 'todos') return true
  const ranges: Record<string, [number, number]> = {
    '0-2': [0, 2],
    '3-5': [3, 5],
    '6-8': [6, 8],
    '9-12': [9, 12],
    '12+': [12, 99],
  }
  const [rMin, rMax] = ranges[filter]
  const pMin = producto.edad_min ?? 0
  const pMax = producto.edad_max ?? 99
  return pMin <= rMax && pMax >= rMin
}

export function EmployeeCatalogPage() {
  const { token } = useParams<{ token: string }>()
  const { empresa, catalogo, isLoading: catalogLoading, isError, notFound } = useCatalog(token)
  const { data: productos = [], isLoading: productsLoading } = useProducts(catalogo?.id)
  const { empleado, authState, login, clearSession } = useEmployeeAuth(empresa, token)
  const order = useOrder()

  const [step, setStep] = useState<PageStep>('login')
  const [search, setSearch] = useState('')
  const [sexoFilter, setSexoFilter] = useState<SexoFilter>('todos')
  const [edadFilter, setEdadFilter] = useState<EdadFilter>('todos')
  const [sortOption, setSortOption] = useState<SortOption>('precio-asc')
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null)
  const [orderPanelOpen, setOrderPanelOpen] = useState(false)
  const autoOpenedRef = useRef(false)

  // Auto-advance to catalog if already authenticated via sessionStorage
  const isAuthenticated = !!empleado
  const currentStep: PageStep = isAuthenticated ? (step === 'login' ? 'catalog' : step) : 'login'

  const remainingQuota = empleado ? empleado.cantidad_hijos - order.totalItems : undefined

  // Auto-open order panel when quota is complete
  useEffect(() => {
    if (!empleado) return
    if (order.totalItems === empleado.cantidad_hijos && order.totalItems > 0 && !autoOpenedRef.current) {
      autoOpenedRef.current = true
      setTimeout(() => setOrderPanelOpen(true), 2000)
    }
    if (order.totalItems < empleado.cantidad_hijos) {
      autoOpenedRef.current = false
    }
  }, [order.totalItems, empleado])

  const filteredProducts = useMemo(() => {
    let result = [...productos]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((p) => p.nombre.toLowerCase().includes(q))
    }

    if (sexoFilter !== 'todos') {
      result = result.filter((p) =>
        p.sexo === sexoFilter || (sexoFilter !== 'bebe' && p.sexo === 'unisex')
      )
    }

    result = result.filter((p) => matchesEdad(p, edadFilter))

    result.sort((a, b) =>
      sortOption === 'precio-asc'
        ? (a.precio ?? 0) - (b.precio ?? 0)
        : (b.precio ?? 0) - (a.precio ?? 0)
    )

    return result
  }, [productos, search, sexoFilter, edadFilter, sortOption])

  const isLoading = catalogLoading || productsLoading

  if (notFound) return <NotFoundPage />

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center px-4">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-text mb-2">Algo salió mal</h2>
          <p className="text-slate-500 text-sm">No pudimos cargar el catálogo. Por favor, intentá de nuevo.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-5 py-2 bg-primary text-white rounded-xl font-medium text-sm"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  // Login screen
  if (currentStep === 'login') {
    return (
      <EmployeeLogin
        empresaNombre={empresa?.nombre ?? ''}
        isLoading={catalogLoading || authState.status === 'loading'}
        errorMessage={authState.status === 'error' ? authState.message : null}
        onLogin={login}
      />
    )
  }

  // Order summary
  if (currentStep === 'summary' && empresa && catalogo && empleado) {
    return (
      <EmployeeOrderSummary
        items={order.items}
        empresa={empresa}
        catalogo={catalogo}
        empleado={empleado}
        onBack={() => setStep('catalog')}
        onSuccess={(pedidoId) => {
          order.clearOrder()
          clearSession()
          window.location.href = `/pedido-confirmado/${pedidoId}`
        }}
      />
    )
  }

  // Quota banner text
  const quotaBannerText = () => {
    if (!empleado) return ''
    const used = order.totalItems
    const total = empleado.cantidad_hijos
    if (used === 0) return `Podés elegir ${total} ${total === 1 ? 'regalo' : 'regalos'}`
    if (used >= total) return `¡Completaste tu selección! 🎁`
    const left = total - used
    return `Elegiste ${used} de ${total} regalos · Te ${left === 1 ? 'queda' : 'quedan'} ${left} ${left === 1 ? 'regalo' : 'regalos'}`
  }

  const quotaComplete = empleado ? order.totalItems >= empleado.cantidad_hijos : false

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        empresa={empresa}
        totalItems={order.totalItems}
        onOpenOrder={() => setOrderPanelOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-5">
        {/* Hero strip */}
        {!catalogLoading && empresa && empleado && (
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl px-5 py-4">
            <p className="text-sm text-slate-500">Hola, <strong className="text-text">{empleado.nombre_apellido}</strong></p>
            <h2 className="font-bold text-text text-lg">{empresa.nombre}</h2>
          </div>
        )}

        {/* Quota counter */}
        {empleado && (
          <div className={`rounded-2xl px-5 py-3 flex items-center gap-3 border ${
            quotaComplete
              ? 'bg-green-50 border-green-200'
              : 'bg-white border-slate-200'
          }`}>
            <span className="text-xl flex-shrink-0">{quotaComplete ? '✅' : '🎁'}</span>
            <p className={`font-semibold text-sm ${quotaComplete ? 'text-green-700' : 'text-slate-700'}`}>
              {quotaBannerText()}
            </p>
            {!quotaComplete && remainingQuota !== undefined && (
              <div className="ml-auto flex gap-1">
                {Array.from({ length: empleado.cantidad_hijos }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full ${i < order.totalItems ? 'bg-primary' : 'bg-slate-200'}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search */}
        <SearchBar value={search} onChange={setSearch} />

        {/* Filters */}
        <FilterBar
          sexo={sexoFilter}
          edad={edadFilter}
          sort={sortOption}
          hasActiveFilters={!!search.trim() || sexoFilter !== 'todos' || edadFilter !== 'todos'}
          onSexoChange={setSexoFilter}
          onEdadChange={setEdadFilter}
          onSortChange={setSortOption}
          onClear={() => {
            setSearch('')
            setSexoFilter('todos')
            setEdadFilter('todos')
            setSortOption('precio-asc')
          }}
        />

        {/* Count */}
        {!isLoading && (
          <p className="text-sm text-slate-400">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* Grid */}
        <ProductGrid
          productos={filteredProducts}
          mostrarPrecios={false}
          getItemQuantity={order.getItemQuantity}
          remainingQuota={remainingQuota}
          onProductClick={setSelectedProduct}
          onAdd={(p) => order.addItem(p, 1)}
          onUpdateQuantity={order.updateQuantity}
          isLoading={isLoading}
        />
      </main>

      <Footer />

      {/* Floating button */}
      {order.totalItems > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 sm:hidden">
          <button
            onClick={() => setOrderPanelOpen(true)}
            className="flex items-center gap-2 bg-primary text-white font-semibold px-5 py-3 rounded-full shadow-lg active:scale-95 transition-all"
          >
            <span>🎁</span>
            <span>Mi selección</span>
            <span className="bg-white text-primary font-bold rounded-full text-xs px-2 py-0.5">
              {order.totalItems}
            </span>
          </button>
        </div>
      )}

      {/* Product detail modal */}
      <ProductDetail
        producto={selectedProduct}
        mostrarPrecios={false}
        currentQuantity={selectedProduct ? order.getItemQuantity(selectedProduct.id) : 0}
        onClose={() => setSelectedProduct(null)}
        onAdd={(p, qty) => order.addItem(p, qty)}
        onUpdateQuantity={order.updateQuantity}
      />

      {/* Order panel */}
      <OrderPanel
        isOpen={orderPanelOpen}
        items={order.items}
        mostrarPrecios={false}
        totalPrice={order.totalPrice}
        onClose={() => setOrderPanelOpen(false)}
        onUpdateQuantity={order.updateQuantity}
        onRemove={order.removeItem}
        onConfirm={() => {
          setOrderPanelOpen(false)
          setStep('summary')
        }}
      />
    </div>
  )
}
