# 🔴 RappiClone — Prototipo tipo Rappi (React 18 + TS + Vite + Supabase)

Prototipo **production-ready** inspirado en la arquitectura pública de [rappi.com.co](https://www.rappi.com.co/), construido tras un **RAE (Reverse Engineer Anything)** del sitio. Incluye home con hero/categorías/banners, catálogo de tiendas y menús, buscador, carrito multi-tienda, checkout simulado, tracking de pedidos en tiempo real y dashboard con gráficas.

> ⚠️ Proyecto educativo sin afiliación con Rappi Inc. No usa assets ni marcas registradas de Rappi; los textos e imágenes son genéricos/licencia libre (picsum.photos).

---

## 1. Hallazgos del RAE de rappi.com.co

Se analizó el HTML servido por `https://www.rappi.com.co/` (Next.js SSR con `__NEXT_DATA__`) y se extrajo:

| Área | Hallazgo | Aplicado en el prototipo |
|---|---|---|
| **Stack detectado** | Next.js + i18next (`es-CO`), datos server-side (`homeData`, `topRestaurants`, `storeBanners`, `pushBanners`) | React 18 + Vite (SPA más ligera para este alcance); datos espejo en Supabase / seed local |
| **Rutas principales** | `/restaurants`, `/markets`, `/super-farma`, `/tiendas`, `/turbo`, `/travel`, `/orders`, `/login` | `/restaurantes`, `/tiendas/:tipo`, `/mis-pedidos`, `/carrito`, `/buscar`, `/login` |
| **Categorías populares** | `restaurant`, `market`, `super_farma`, `turbo` (flag `isPopularCategory`) | Mismo modelo `categories` con `is_popular` y orden |
| **Modelo de tienda** | `title`, `url`, `bgImage`, `logo`, `eta`, `deliveryCost`, `hasFreeShipping`, `tags` | Tabla `stores` + interfaz `Store` idénticas |
| **Bloques de home** | Hero "Si tienes Rappi, tienes Todo" + buscador + chips frecuentes → categorías → banners → top restaurantes → propuesta de valor (ahorra tiempo / 24 horas / encuentras de todo) → tiendas destacadas | Se replicó la misma jerarquía con copy genérico equivalente |
| **Marca visual** | Rojo corporativo `#ff441f`, verde `#29d884`, sans redondeada, radios grandes, header sticky blanco con buscador | Tokens Tailwind v4 `--color-rappi`, `--color-mint`, fuente Inter |
| **Checkout** | Agrupación por tienda, métodos de pago colombianos (tarjeta, efectivo, PSE, Nequi), costos de servicio/despacho | Carrito multi-tienda + resumen con despacho gratis > $60.000 y fee 5% |
| **Tracking** | Estados: confirmado → preparación → despacho → entregado, con realtime | Enum `order_status` + Supabase Realtime (`postgres_changes`) |

## 2. Stack elegido

- **React 18 + TypeScript + Vite 5** — HMR instantáneo, build optimizado con code-splitting manual (react / charts / motion / supabase).
- **Tailwind CSS v4** (`@tailwindcss/vite`) — design tokens en `@theme`, cero configuración PostCSS.
- **Framer Motion** — animaciones de entrada, hover, stepper de tracking y micro-interacciones del carrito.
- **Recharts** — dashboard de pedidos (área, barras horizontales, dona).
- **React Router v6** — rutas declarativas con layout compartido.
- **Supabase** — Auth (email/password), DB (PostgreSQL + RLS), Realtime (tracking), Storage (imágenes de aliados).
- **Lucide React** — iconografía SVG tree-shakeable.

**Modo demo sin backend:** si no hay `.env` con credenciales Supabase, la app funciona 100% con datos semilla locales y persistencia en `localStorage` (auth, carrito, pedidos con driver de estados simulado). Puedes desplegar y demostrar de inmediato y luego "enchufar" Supabase sin tocar la UI.

## 3. Estructura

```
app/
├── src/
│   ├── components/   Header, Footer, Layout, StoreCard, ProductCard
│   ├── context/      AuthContext (Supabase/demo), CartContext
│   ├── hooks/        useOrders (CRUD + realtime + simulación)
│   ├── data/         seed.ts (categorías, tiendas, productos, banners)
│   ├── lib/          supabase.ts (cliente perezoso + flag hasSupabase)
│   ├── pages/        Home, Login, Search, StoreList, StoreDetail, Cart, Orders
│   └── types/        Modelos espejo de las tablas
├── supabase/
│   ├── schema.sql    Tablas, triggers, enums, realtime, RLS
│   └── seed.sql      Datos semilla idénticos al modo demo
└── .env.example      VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
```

## 4. Creación de la base de datos en Supabase — PASO A PASO

### Paso 1 — Crear el proyecto
1. Entra a <https://supabase.com/dashboard> y crea cuenta (GitHub es lo más rápido).
2. **New Project** → nombre: `prototiporrapi` → contraseña DB (guárdala) → Region: **South America (São Paulo)** (la más cercana a Colombia).
3. Espera ~2 minutos al provisionamiento.

### Paso 2 — Ejecutar el esquema
1. En el dashboard: **SQL Editor → New query**.
2. Copia **todo** el contenido de [`supabase/schema.sql`](app/supabase/schema.sql) y pégalo.
3. Presiona **Run** → debe decir *Success. No rows returned*.
   - Crea: `categories`, `stores`, `products`, `profiles`, `addresses`, `orders`, enum `order_status`, triggers (`handle_new_user`, `touch_updated_at`), publica `orders` para Realtime y habilita **RLS con políticas**.

### Paso 3 — Cargar los datos semilla
1. **SQL Editor → New query** otra vez.
2. Copia **todo** el contenido de [`supabase/seed.sql`](app/supabase/seed.sql) → **Run**.
3. Verifica en **Table Editor**: `categories` (10 filas), `stores` (13), `products` (43).

### Paso 4 — Configurar Autenticación
1. **Authentication → Sign In / Up**: deja habilitado **Email** (desactiva "Confirm email" para login inmediato en desarrollo; en producción déjalo activo con SMTP propio).
2. **Authentication → URL Configuration**:
   - Site URL: tu dominio de producción (p. ej. `https://tu-app.vercel.app`).
   - Redirect URLs: agrega `http://localhost:5173/auth/callback` para desarrollo.

### Paso 5 — Obtener las claves del frontend
1. **Project Settings → API**:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY` (**nunca** uses la `service_role` en el frontend).
2. En el repo local: `cp app/.env.example app/.env` y pega ambos valores.

### Paso 6 — (Opcional) Storage para imágenes reales
1. **Storage → New bucket** llamado `store-images`, público.
2. Sube logos/fotos de tus aliados ficticios y actualiza `bg_image_url` / `logo_url` / `image_url` con las URLs públicas del bucket.

### Paso 7 — Verificar Realtime
- La tabla `orders` ya fue añadida a la publicación `supabase_realtime` en el Paso 2. Prueba: crea un pedido logueado y ejecuta en SQL Editor
  `update public.orders set status='en_camino' where true;`
  → la pantalla **Mis pedidos** debe actualizarse sola.

### Modelo de datos (resumen)

```
auth.users 1───N profiles            (trigger automático al registrarse)
           1───N addresses
           1───N orders ──N1 stores  (snapshot store_title/items jsonb)
categories 1───N stores 1───N products
orders.status: confirmado → en_preparacion → en_camino → entregado | cancelado
```

**Seguridad RLS incluida:** catálogo de lectura pública; perfiles/direcciones/pedidos solo accesibles por su dueño (`auth.uid()`); escritura de catálogo reservada a `service_role`.

## 5. Correr en local

```bash
cd app
npm install
cp .env.example .env   # opcional: sin esto corre en modo demo
npm run dev            # http://localhost:5173
```

## 6. Lanzar a producción

### Opción A — Vercel (recomendada)
1. Sube este repo a GitHub (remoto: `git@github.com:FRCardozo/prototiporrapi.git`).
2. En <https://vercel.com> → **Import Project** → selecciona `FRCardozo/prototiporrapi`.
3. **Root Directory**: `app` · Framework: *Vite* (auto) · Build: `npm run build` · Output: `dist`.
4. Agrega las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` → Deploy.
5. En Supabase, añade el dominio resultante a **Auth → URL Configuration → Site URL**.
6. SPA routing: Vercel sirve `index.html` para todas las rutas automáticamente. En otros hosts, reescribe 404→`/index.html`.

### Opción B — Netlify
- `Build command: npm run build`, `Publish directory: dist` y crea `public/_redirects` con `/* /index.html 200`.

### Checklist pre-producción
- [ ] Variables `.env` cargadas en el host (no commitear `.env`).
- [ ] Confirmación de email activada + SMTP propio.
- [ ] Imágenes propias en bucket `store-images`.
- [ ] Pagos reales (Wompi/Bold/PayU vía Edge Function) — hoy el checkout es simulado.
- [ ] Backups y rate limiting en Supabase (plan Pro si crece).

## 7. Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Type-check + build de producción |
| `npm run preview` | Sirve el build localmente |

---

Hecho con ♥ sobre los cimientos del análisis RAE de rappi.com.co — cualquier parecido es coincidencia educativa.
