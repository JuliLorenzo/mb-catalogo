import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CatalogPage } from './pages/CatalogPage'
import { EmployeeCatalogPage } from './pages/EmployeeCatalogPage'
import { OrderConfirmedPage } from './pages/OrderConfirmedPage'
import { NotFoundPage } from './pages/NotFoundPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/c/:token" element={<CatalogPage />} />
          <Route path="/e/:token" element={<EmployeeCatalogPage />} />
          <Route path="/pedido-confirmado/:pedidoId" element={<OrderConfirmedPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/" element={<Navigate to="/404" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
