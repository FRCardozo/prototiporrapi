import type { Banner, Category, Product, Store } from '../types';

// Imágenes deterministas (sin depender de assets con copyright de Rappi)
const img = (seed: string, w = 600, h = 400) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

export const COP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

export const categories: Category[] = [
  { id: 'restaurant', title: 'Restaurantes', icon: '🍔', image: img('cat-rest', 200, 200), url: '/restaurantes', isPopularCategory: true },
  { id: 'market', title: 'Mercados', icon: '🛒', image: img('cat-market', 200, 200), url: '/tiendas/market', isPopularCategory: true },
  { id: 'super_farma', title: 'Farmacia', icon: '💊', image: img('cat-farma', 200, 200), url: '/tiendas/farma', isPopularCategory: true },
  { id: 'turbo', title: 'Turbo', icon: '⚡', image: img('cat-turbo', 200, 200), url: '/tiendas/turbo', isPopularCategory: true },
  { id: 'tiendas', title: 'Tiendas', icon: '🛍️', image: img('cat-stores', 200, 200), url: '/tiendas', isPopularCategory: false },
  { id: 'liquor_store', title: 'Licores', icon: '🍷', image: img('cat-liquor', 200, 200), url: '/tiendas/licores', isPopularCategory: false },
  { id: 'petshop', title: 'Mascotas', icon: '🐶', image: img('cat-pet', 200, 200), url: '/tiendas/pet', isPopularCategory: false },
  { id: 'postres', title: 'Postres', icon: '🍰', image: img('cat-dessert', 200, 200), url: '/restaurantes?cat=postres', isPopularCategory: false },
  { id: 'cafe', title: 'Cafés', icon: '☕', image: img('cat-coffee', 200, 200), url: '/restaurantes?cat=cafeteria', isPopularCategory: false },
  { id: 'travel', title: 'Viajes', icon: '✈️', image: img('cat-travel', 200, 200), url: '/viajes', isPopularCategory: false },
];

export const stores: Store[] = [
  // Restaurantes
  { id: 101, title: 'RappiClone Burgers', slug: 'rappiclone-burgers', categoryId: 'restaurant', bgImage: img('store-burger'), logo: img('logo-burger', 96, 96), eta: '15 min', deliveryCost: 4000, hasFreeShipping: false, rating: 4.7, tags: ['Hamburguesas', 'Fast food'], featured: true },
  { id: 102, title: 'La Croissanterie', slug: 'la-croissanterie', categoryId: 'restaurant', bgImage: img('store-croissant'), logo: img('logo-croissant', 96, 96), eta: '20 min', deliveryCost: 3000, hasFreeShipping: true, rating: 4.5, tags: ['Panadería', 'Cafetería'], featured: true },
  { id: 103, title: 'El Wok Express', slug: 'el-wok-express', categoryId: 'restaurant', bgImage: img('store-asian'), logo: img('logo-asian', 96, 96), eta: '25 min', deliveryCost: 4500, hasFreeShipping: false, rating: 4.6, tags: ['Asiática', 'Tailandesa'], featured: false },
  { id: 104, title: 'Pizza Fuego', slug: 'pizza-fuego', categoryId: 'restaurant', bgImage: img('store-pizza'), logo: img('logo-pizza', 96, 96), eta: '30 min', deliveryCost: 0, hasFreeShipping: true, rating: 4.4, tags: ['Pizza', 'Italiana'], featured: true },
  { id: 105, title: 'Alitas del Barrio', slug: 'alitas-del-barrio', categoryId: 'restaurant', bgImage: img('store-wings'), logo: img('logo-wings', 96, 96), eta: '28 min', deliveryCost: 3500, hasFreeShipping: false, rating: 4.8, tags: ['Pollo', 'Alitas'], featured: false },
  { id: 106, title: 'Sushi Zen', slug: 'sushi-zen', categoryId: 'restaurant', bgImage: img('store-sushi'), logo: img('logo-sushi', 96, 96), eta: '35 min', deliveryCost: 5000, hasFreeShipping: false, rating: 4.9, tags: ['Japonesa', 'Sushi'], featured: true },
  { id: 107, title: 'Crepes & Waffles Clone', slug: 'crepes-waffles', categoryId: 'restaurant', bgImage: img('store-crepe'), logo: img('logo-crepe', 96, 96), eta: '22 min', deliveryCost: 2500, hasFreeShipping: true, rating: 4.6, tags: ['Postres', 'Cafetería'], featured: false },
  { id: 108, title: 'Tacos Locos', slug: 'tacos-locos', categoryId: 'restaurant', bgImage: img('store-taco'), logo: img('logo-taco', 96, 96), eta: '18 min', deliveryCost: 3000, hasFreeShipping: false, rating: 4.3, tags: ['Mexicana'], featured: false },
  // Mercados
  { id: 201, title: 'Mercado La 80', slug: 'mercado-la-80', categoryId: 'market', bgImage: img('store-market1'), logo: img('logo-market1', 96, 96), eta: '40 min', deliveryCost: 5000, hasFreeShipping: false, rating: 4.5, tags: ['Supermercado'], featured: true },
  { id: 202, title: 'Express Verde', slug: 'express-verde', categoryId: 'market', bgImage: img('store-market2'), logo: img('logo-market2', 96, 96), eta: '20 min', deliveryCost: 2000, hasFreeShipping: true, rating: 4.2, tags: ['Tienda express', 'Frutas'], featured: false },
  // Farmacia / Licores / Tiendas
  { id: 301, title: 'FarmaPlus', slug: 'farmaplus', categoryId: 'super_farma', bgImage: img('store-farma'), logo: img('logo-farma', 96, 96), eta: '25 min', deliveryCost: 3000, hasFreeShipping: false, rating: 4.4, tags: ['Farmacia', 'Salud'], featured: true },
  { id: 401, title: 'Vinos & Más', slug: 'vinos-y-mas', categoryId: 'liquor_store', bgImage: img('store-liquor'), logo: img('logo-liquor', 96, 96), eta: '30 min', deliveryCost: 4000, hasFreeShipping: false, rating: 4.6, tags: ['Licores', 'Vinos'], featured: false },
  { id: 501, title: 'TechStore Turbo', slug: 'techstore-turbo', categoryId: 'turbo', bgImage: img('store-tech'), logo: img('logo-tech', 96, 96), eta: '45 min', deliveryCost: 6000, hasFreeShipping: true, rating: 4.7, tags: ['Tecnología', 'Gadgets'], featured: true },
];

interface P extends Omit<Product, 'id' | 'storeId'> {}

const menu = (storeId: number, items: P[]): Product[] =>
  items.map((it, i) => ({ ...it, id: storeId * 100 + i + 1, storeId }));

export const products: Product[] = [
  ...menu(101, [
    { name: 'Hamburguesa Clásica Doble', description: 'Doble carne 200g, queso cheddar, tocino y salsa de la casa.', price: 28900, compareAtPrice: 35900, image: img('p-doble'), category: 'Hamburguesas', popular: true },
    { name: 'Crispy Chicken Burger', description: 'Pollo crocante,coleslaw y miel mostaza.', price: 26900, image: img('p-chicken'), category: 'Hamburguesas', popular: true },
    { name: 'Papas a la Francesa Grandes', description: 'Porción generosa con sal de ajo.', price: 9900, image: img('p-papas'), category: 'Complementos', popular: false },
    { name: 'Malteada de Oreo', description: 'Helado premium batido con galleta oreo.', price: 12900, image: img('p-shake'), category: 'Bebidas', popular: true },
    { name: 'Combo Familiar x4', description: '4 hamburguesas clásicas + 2 papas grandes + 4 gaseosas.', price: 89900, compareAtPrice: 105000, image: img('p-combo'), category: 'Combos', popular: true },
  ]),
  ...menu(102, [
    { name: 'Croissant de Jamón y Queso', description: 'Recién horneado, mantequilla francesa.', price: 8900, image: img('p-croi'), category: 'Panadería', popular: true },
    { name: 'Café Americano Grande', description: 'Origen Nariño, tueste medio.', price: 6500, image: img('p-cafe'), category: 'Bebidas', popular: true },
    { name: 'Cheesecake de Maracuyá', description: 'Base de galleta y coulis de maracuyá.', price: 13900, image: img('p-cheese'), category: 'Postres', popular: false },
    { name: 'Sándwich Pollo César', description: 'Pollo grillé, lechuga romana y aderejo césar.', price: 18900, image: img('p-caesar'), category: 'Sándwiches', popular: false },
  ]),
  ...menu(103, [
    { name: 'Pad Thai con Pollo', description: 'Fideos de arroz, maní, brotes y limón.', price: 24900, image: img('p-padthai'), category: 'Asiática', popular: true },
    { name: 'Arroz Frito Especial', description: 'Con huevo, cerdo y vegetales salteados.', price: 22900, image: img('p-arroz'), category: 'Asiática', popular: false },
    { name: 'Rolls de Primavera x6', description: 'Envueltos en papel de arroz con salsa dulce.', price: 15900, image: img('p-rolls'), category: 'Entradas', popular: false },
  ]),
  ...menu(104, [
    { name: 'Pizza Pepperoni Grande', description: 'Masa artesanal, mozzarella y pepperoni importado.', price: 32900, compareAtPrice: 39900, image: img('p-pepperoni'), category: 'Pizzas', popular: true },
    { name: 'Pizza Hawaiana', description: 'Jamón piña y queso mozzarella.', price: 30900, image: img('p-hawaiana'), category: 'Pizzas', popular: false },
    { name: 'Aros de Cebolla x10', description: 'Rebozado crocante con dip BBQ.', price: 11900, image: img('p-aros'), category: 'Complementos', popular: false },
  ]),
  ...menu(105, [
    { name: 'Alitas BBQ x12', description: 'Glaseado ahumado con sésamo.', price: 27900, image: img('p-alitas'), category: 'Pollo', popular: true },
    { name: 'Alitas Picantes x12', description: 'Salsa habanero, nivel fuego 🔥.', price: 27900, image: img('p-alitas2'), category: 'Pollo', popular: true },
    { name: 'Caja Papa x8', description: 'Pollo crocante con papas y ensalada.', price: 33900, image: img('p-caja'), category: 'Pollo', popular: false },
  ]),
  ...menu(106, [
    { name: 'Rollos California x8', description: 'Cangrejo, palta y masago.', price: 26900, image: img('p-cali'), category: 'Sushi', popular: true },
    { name: 'Komodo Roll x8', description: 'Salmão flambeado, spici mayo y cebollín.', price: 34900, image: img('p-komodo'), category: 'Sushi', popular: true },
    { name: 'Tempura de Camarón', description: '6 unidades con salsa tentsuyu.', price: 21900, image: img('p-tempura'), category: 'Calientes', popular: false },
  ]),
  ...menu(107, [
    { name: 'Waffle con Helado', description: 'Waffle belga, helado de vainilla y fresas.', price: 18900, image: img('p-waffle'), category: 'Postres', popular: true },
    { name: 'Crepioca Nutella', description: 'Crepe rellena de nutella y banana.', price: 15900, image: img('p-crepe'), category: 'Postres', popular: false },
    { name: 'Limonada de Coco', description: 'Coco rallado, limón y hierbabuena.', price: 9900, image: img('p-limonada'), category: 'Bebidas', popular: false },
  ]),
  ...menu(108, [
    { name: 'Tacos al Pastor x3', description: 'Piña, cilantro y cebolla morada.', price: 21900, image: img('p-taco'), category: 'Mexicana', popular: true },
    { name: 'Burrito SupremoS', description: 'Carne asada, arroz, frijoles y guacamole.', price: 24900, image: img('p-burrito'), category: 'Mexicana', popular: false },
    { name: 'Nachos con Guacamole', description: 'Totopos, queso fundido y pico de gallo.', price: 16900, image: img('p-nachos'), category: 'Antojos', popular: false },
  ]),
  ...menu(201, [
    { name: 'Leche Entera 1L', description: 'Pasterizada tipo Himalaya.', price: 5800, image: img('p-leche'), category: 'Lácteos', popular: true },
    { name: 'Huevos x12', description: 'Grado A, caja de 12 unidades.', price: 12900, image: img('p-huevo'), category: 'Granja', popular: true },
    { name: 'Plátano Maduro x6', description: 'Seleción maduro ideal para patacones.', price: 4500, image: img('p-platano'), category: 'Frutas', popular: false },
    { name: 'Café Premium 500g', description: 'Molido, tueste oscuro, origen Colombia.', price: 18900, compareAtPrice: 22900, image: img('p-cafebolsa'), category: 'Despensa', popular: true },
  ]),
  ...menu(202, [
    { name: 'Agua embotellada 2.5L', description: 'Sin gas.', price: 4200, image: img('p-agua'), category: 'Bebidas', popular: false },
    { name: 'Doritos Nacho x2', description: 'Pack doble 160g.', price: 11500, image: img('p-doritos'), category: 'Snacks', popular: true },
    { name: 'Avena Hojuelas 500g', description: 'Integral sin azúcar añadida.', price: 7900, image: img('p-avena'), category: 'Despensa', popular: false },
  ]),
  ...menu(301, [
    { name: 'Acetaminofén 500mg x20', description: 'Tabletas para el dolor y la fiebre.', price: 6900, image: img('p-para'), category: 'Analgésicos', popular: true },
    { name: 'Vitamina C 1g x30', description: 'Efervescente sabor naranja.', price: 15900, image: img('p-vitic'), category: 'Vitaminas', popular: true },
    { name: 'Protector Solar FPS 50', description: 'Toque seco, 120ml.', price: 38900, compareAtPrice: 45900, image: img('p-solar'), category: 'Cuidado personal', popular: false },
  ]),
  ...menu(401, [
    { name: 'Cerveza Artesanal IPA 330ml', description: 'Edición limitada lúpulo cítrico.', price: 12900, image: img('p-cerveza'), category: 'Cervecería', popular: true },
    { name: 'Vino Tinto Cabernet 750ml', description: 'Reserva, notas de frutos rojos.', price: 58900, compareAtPrice: 72000, image: img('p-vino'), category: 'Vinos', popular: true },
    { name: 'Whisky 12 años 700ml', description: 'Single malt importado.', price: 189000, image: img('p-whisky'), category: 'Whisky', popular: false },
  ]),
  ...menu(501, [
    { name: 'Audífonos Inalámbricos Pro', description: 'Cancelación de ruido activa, 30h batería.', price: 149900, compareAtPrice: 199900, image: img('p-air'), category: 'Audio', popular: true },
    { name: 'Smartwatch Fit S2', description: 'Monitor cardíaco, GPS y AMOLED.', price: 129900, image: img('p-watch'), category: 'Wearables', popular: true },
    { name: 'Teclado Mecánico RGB', description: 'Switch red, layout ES.', price: 89900, image: img('p-key'), category: 'Gaming', popular: false },
  ]),
];

export const banners: Banner[] = [
  { id: 'b1', title: 'Envío GRATIS por 30 días', subtitle: 'En tus primeros pedidos pagando con tarjeta', cta: '¡Pide ahora!', href: '/restaurantes', gradient: 'from-rappi to-[#ff7a4d]', emoji: '🛵' },
  { id: 'b2', title: 'Mercado con hasta 40% OFF', subtitle: 'Despensa fresca directo a tu puerta', cta: 'Ver ofertas', href: '/tiendas/market', gradient: 'from-mint-dark to-mint', emoji: '🥑' },
  { id: 'b3', title: 'Turbo: lo que necesitas en minutos', subtitle: 'Tecnología y antojos exprés', cta: 'Descubrir', href: '/tiendas/turbo', gradient: 'from-violet-brand to-[#9b4dff]', emoji: '⚡' },
];

export const topSearchTerms = ['hamburguesa', 'pizza', 'sushi', 'café', 'alitas', 'mercado', 'cerveza', 'croissant'];

export const getProductsByStore = (storeId: number) => products.filter((p) => p.storeId === storeId);
export const getStoreById = (id: number) => stores.find((s) => s.id === id);
export const getStoreBySlug = (slug: string) => stores.find((s) => s.slug === slug);
