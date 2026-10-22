// ─── Modelos de dominio (espejo de las tablas de Supabase) ────────────────

export type CategoryId =
  | 'restaurant'
  | 'market'
  | 'super_farma'
  | 'tiendas'
  | 'turbo'
  | 'liquor_store'
  | 'travel';

export interface Category {
  id: string;
  title: string;
  icon: string; // emoji o nombre de icono lucide
  image: string; // seed de picsum con clave estable
  url: string;
  isPopularCategory: boolean;
}

export interface Store {
  id: number;
  title: string;
  slug: string;
  categoryId: string;
  bgImage: string;
  logo: string;
  eta: string; // "14 min"
  deliveryCost: number; // COP
  hasFreeShipping: boolean;
  rating: number; // 0..5
  tags: string[];
  featured: boolean;
}

export interface Product {
  id: number;
  storeId: number;
  name: string;
  description: string;
  price: number; // COP
  compareAtPrice?: number;
  image: string;
  category: string;
  popular: boolean;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export type OrderStatus = 'confirmado' | 'en_preparacion' | 'en_camino' | 'entregado' | 'cancelado';

export interface Order {
  id: string;
  userId: string;
  storeTitle: string;
  storeImage: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  address: string;
}

export interface Address {
  id: string;
  label: string;
  line: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  gradient: string;
  emoji: string;
}
