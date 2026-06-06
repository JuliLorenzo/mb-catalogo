-- =====================================================
-- Mundo Barrilete — Catálogo Digital
-- Schema completo con tablas y RLS
-- =====================================================

-- ===========================
-- TABLAS
-- ===========================

CREATE TABLE productos (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre       text NOT NULL,
  descripcion  text,
  precio       numeric NOT NULL,
  fotos        text[],
  edad_min     integer,
  edad_max     integer,
  sexo         text CHECK (sexo IN ('nene', 'nena', 'unisex', 'bebe')),
  marca        text,
  activo       boolean DEFAULT true,
  created_at   timestamptz DEFAULT now()
);

CREATE TABLE empresas (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre          text NOT NULL,
  email_contacto  text,
  mostrar_precios boolean DEFAULT true,
  token_acceso    text UNIQUE NOT NULL,
  created_at      timestamptz DEFAULT now()
);

CREATE TABLE catalogos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id  uuid REFERENCES empresas(id),
  nombre      text NOT NULL,
  activo      boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE catalogo_productos (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  catalogo_id  uuid REFERENCES catalogos(id),
  producto_id  uuid REFERENCES productos(id),
  UNIQUE (catalogo_id, producto_id)
);

CREATE TABLE pedidos (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id    uuid REFERENCES empresas(id),
  catalogo_id   uuid REFERENCES catalogos(id),
  estado        text DEFAULT 'pendiente',
  observaciones text,
  created_at    timestamptz DEFAULT now()
);

CREATE TABLE pedido_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id   uuid REFERENCES pedidos(id),
  producto_id uuid REFERENCES productos(id),
  cantidad    integer DEFAULT 1
);

-- ===========================
-- ROW LEVEL SECURITY
-- ===========================

ALTER TABLE productos          ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas           ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogos          ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogo_productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos            ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedido_items       ENABLE ROW LEVEL SECURITY;

-- productos: lectura pública de productos activos
CREATE POLICY "productos_select_public"
  ON productos FOR SELECT
  USING (activo = true);

-- empresas: lectura pública (filtro por token en la query)
CREATE POLICY "empresas_select_by_token"
  ON empresas FOR SELECT
  USING (true);

-- catalogos: lectura pública de catálogos activos
CREATE POLICY "catalogos_select_public"
  ON catalogos FOR SELECT
  USING (activo = true);

-- catalogo_productos: lectura pública
CREATE POLICY "catalogo_productos_select_public"
  ON catalogo_productos FOR SELECT
  USING (true);

-- pedidos: insert público + lectura pública
CREATE POLICY "pedidos_insert_public"
  ON pedidos FOR INSERT
  WITH CHECK (true);

CREATE POLICY "pedidos_select_public"
  ON pedidos FOR SELECT
  USING (true);

-- pedido_items: insert público + lectura pública
CREATE POLICY "pedido_items_insert_public"
  ON pedido_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "pedido_items_select_public"
  ON pedido_items FOR SELECT
  USING (true);
