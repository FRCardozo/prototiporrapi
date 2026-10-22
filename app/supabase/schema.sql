-- ============================================================================
-- RAPPICLONE — ESQUEMA SUPABASE (PostgreSQL 15+)
-- Ejecutar en: Supabase Dashboard -> SQL Editor -> New query -> Run
-- ============================================================================

-- ─── 1. CATEGORÍAS ──────────────────────────────────────────────────────────
create table if not exists public.categories (
  id text primary key,                    -- 'restaurant', 'market', ...
  title text not null,
  icon text not null default '',
  image_url text,
  url text not null,
  is_popular boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ─── 2. TIENDAS / ALIADOS ───────────────────────────────────────────────────
create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  category_id text not null references public.categories(id),
  title text not null,
  slug text not null unique,
  bg_image_url text,
  logo_url text,
  eta_minutes int not null default 30,
  delivery_cost numeric(10,2) not null default 0 check (delivery_cost >= 0),
  has_free_shipping boolean not null default false,
  rating numeric(2,1) not null default 0 check (rating between 0 and 5),
  tags text[] not null default '{}',
  is_featured boolean not null default false,
  city text not null default 'Bogotá',
  is_open boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists stores_category_idx on public.stores (category_id);
create index if not exists stores_city_idx on public.stores (city);

-- ─── 3. PRODUCTOS ───────────────────────────────────────────────────────────
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null,
  description text,
  price numeric(12,2) not null check (price >= 0),
  compare_at_price numeric(12,2),
  image_url text,
  section text not null default 'General',   -- categoría dentro del menú
  is_popular boolean not null default false,
  available boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists products_store_idx on public.products (store_id);

-- ─── 4. PERFILES (extensión de auth.users) ──────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Trigger: crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── 5. DIRECCIONES ─────────────────────────────────────────────────────────
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Casa',
  line text not null,
  lat numeric(9,6),
  lng numeric(9,6),
  created_at timestamptz not null default now()
);

-- ─── 6. PEDIDOS ─────────────────────────────────────────────────────────────
create type public.order_status as enum
  ('confirmado','en_preparacion','en_camino','entregado','cancelado');

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  store_id uuid references public.stores(id),
  store_title text not null,          -- snapshot (la tienda puede cambiar/borrarse)
  store_image text,
  items jsonb not null default '[]',  -- [{name, qty, price}]
  total numeric(12,2) not null default 0,
  status public.order_status not null default 'confirmado',
  address text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_user_idx on public.orders (user_id, created_at desc);

-- Actualiza updated_at automáticamente
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

-- ─── 7. REALTIME ────────────────────────────────────────────────────────────
-- El frontend suscribe postgres_changes sobre orders -> el tracking avanza en vivo
alter publication supabase_realtime add table public.orders;

-- ─── 8. ROW LEVEL SECURITY ──────────────────────────────────────────────────
alter table public.categories enable row level security;
alter table public.stores     enable row level security;
alter table public.products   enable row level security;
alter table public.profiles   enable row level security;
alter table public.addresses  enable row level security;
alter table public.orders     enable row level security;

-- Catálogo público de lectura para cualquiera (visitantes sin login)
create policy "categories_public_read" on public.categories for select using (true);
create policy "stores_public_read"     on public.stores    for select using (true);
create policy "products_public_read"   on public.products  for select using (true);

-- Perfiles: lectura propia y actualización propia
create policy "profiles_self_read"  on public.profiles for select using (auth.uid() = id);
create policy "profiles_self_write" on public.profiles for update using (auth.uid() = id);

-- Direcciones y pedidos: solo el dueño
create policy "addresses_own" on public.addresses for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "orders_select_own" on public.orders for select using (auth.uid() = user_id);
create policy "orders_insert_own" on public.orders for insert with check (auth.uid() = user_id);
create policy "orders_update_own" on public.orders for update using (auth.uid() = user_id);

-- Solo service_role (dashboard/edge functions) puede escribir catálogo
create policy "admin_write_catalog" on public.stores for insert to service_role with check (true);
