# Mundo Barrilete — Catálogo Digital

Catálogo digital personalizado para regalos corporativos del Día del Niño.
Cada empresa recibe un link único y puede armar su pedido desde el catálogo.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Supabase (PostgreSQL + Storage)
- Resend (notificaciones de email)
- React Router v6
- React Query (TanStack)

## Setup

### 1. Clonar e instalar

```bash
git clone <repo>
cd mb-catalogo
npm install
```

### 2. Variables de entorno

Crear un archivo `.env` en la raíz con:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_anon_key
VITE_RESEND_API_KEY=tu_resend_api_key
```

### 3. Configurar Supabase

Podés aplicar el schema desde el archivo `supabase/schema.sql` en el
SQL Editor de Supabase, o usar el MCP de Supabase si tenés Claude Code.

### 4. Correr el proyecto

```bash
npm run dev
```

Abrí [http://localhost:5173/c/test123](http://localhost:5173/c/test123)
para ver el catálogo de la empresa de prueba.

## Estructura

```
src/
├── components/
│   ├── layout/        Header, Footer
│   ├── catalog/       ProductGrid, ProductCard, ProductDetail, FilterBar, SearchBar
│   └── order/         OrderPanel, OrderItem, OrderSummary
├── pages/
│   ├── CatalogPage.tsx        /c/:token
│   ├── OrderConfirmedPage.tsx /pedido-confirmado/:pedidoId
│   └── NotFoundPage.tsx
├── hooks/
│   ├── useCatalog.ts
│   ├── useProducts.ts
│   └── useOrder.ts
├── lib/
│   ├── supabase.ts
│   └── resend.ts
└── types/index.ts
```

## Flujo

1. La empresa recibe el link `/c/{token_acceso}`
2. El sistema valida el token y carga el catálogo correspondiente
3. La empresa navega, filtra y agrega productos a "Mi pedido"
4. Confirma el pedido → se guarda en Supabase + email a Mundo Barrilete
5. Redirige a página de confirmación

## Agregar una empresa nueva

En Supabase, insertá en la tabla `empresas`:

```sql
INSERT INTO empresas (nombre, email_contacto, mostrar_precios, token_acceso)
VALUES ('Nombre Empresa', 'email@empresa.com', true, 'token-unico');
```

Luego creá un catálogo y asigná los productos en `catalogos` y `catalogo_productos`.

## Logo

Colocá el archivo del logo como `/public/logo.jpeg` para que aparezca en el header.

## Notas

- El ícono de pedido es 🎁 (no carrito) — semántica de regalo corporativo
- `mostrar_precios = false` oculta todos los precios en la app
- El email de notificación va a `mundobarriletesj@gmail.com`
