-- ============================================================================
-- RAPPICLONE — DATOS SEMILLA (mismos datos del modo demo del frontend)
-- Ejecutar DESPUÉS de schema.sql en Supabase SQL Editor
-- ============================================================================

insert into public.categories (id, title, icon, image_url, url, is_popular, sort_order) values
  ('restaurant','Restaurantes','🍔','https://picsum.photos/seed/cat-rest/200/200','/restaurantes',true,1),
  ('market','Mercados','🛒','https://picsum.photos/seed/cat-market/200/200','/tiendas/market',true,2),
  ('super_farma','Farmacia','💊','https://picsum.photos/seed/cat-farma/200/200','/tiendas/farma',true,3),
  ('turbo','Turbo','⚡','https://picsum.photos/seed/cat-turbo/200/200','/tiendas/turbo',true,4),
  ('tiendas','Tiendas','🛍️','https://picsum.photos/seed/cat-stores/200/200','/tiendas',false,5),
  ('liquor_store','Licores','🍷','https://picsum.photos/seed/cat-liquor/200/200','/tiendas/licores',false,6),
  ('petshop','Mascotas','🐶','https://picsum.photos/seed/cat-pet/200/200','/tiendas/pet',false,7),
  ('postres','Postres','🍰','https://picsum.photos/seed/cat-dessert/200/200','/restaurantes?cat=postres',false,8),
  ('cafe','Cafés','☕','https://picsum.photos/seed/cat-coffee/200/200','/restaurantes?cat=cafeteria',false,9),
  ('travel','Viajes','✈️','https://picsum.photos/seed/cat-travel/200/200','/viajes',false,10)
on conflict (id) do nothing;

insert into public.stores (id, category_id, title, slug, bg_image_url, logo_url, eta_minutes, delivery_cost, has_free_shipping, rating, tags, is_featured) values
  ('00000000-0000-0000-0000-000000000101','restaurant','RappiClone Burgers','rappiclone-burgers','https://picsum.photos/seed/store-burger/600/400','https://picsum.photos/seed/logo-burger/96/96',15,4000,false,4.7,'{Hamburguesas,"Fast food"}',true),
  ('00000000-0000-0000-0000-000000000102','restaurant','La Croissanterie','la-croissanterie','https://picsum.photos/seed/store-croissant/600/400','https://picsum.photos/seed/logo-croissant/96/96',20,3000,true,4.5,'{"Panadería",Cafetería}',true),
  ('00000000-0000-0000-0000-000000000103','restaurant','El Wok Express','el-wok-express','https://picsum.photos/seed/store-asian/600/400','https://picsum.photos/seed/logo-asian/96/96',25,4500,false,4.6,'{Asiática,Tailandesa}',false),
  ('00000000-0000-0000-0000-000000000104','restaurant','Pizza Fuego','pizza-fuego','https://picsum.photos/seed/store-pizza/600/400','https://picsum.photos/seed/logo-pizza/96/96',30,0,true,4.4,'{Pizza,Italiana}',true),
  ('00000000-0000-0000-0000-000000000105','restaurant','Alitas del Barrio','alitas-del-barrio','https://picsum.photos/seed/store-wings/600/400','https://picsum.photos/seed/logo-wings/96/96',28,3500,false,4.8,'{Pollo,Alitas}',false),
  ('00000000-0000-0000-0000-000000000106','restaurant','Sushi Zen','sushi-zen','https://picsum.photos/seed/store-sushi/600/400','https://picsum.photos/seed/logo-sushi/96/96',35,5000,false,4.9,'{Japonesa,Sushi}',true),
  ('00000000-0000-0000-0000-000000000107','restaurant','Crepes & Waffles Clone','crepes-waffles','https://picsum.photos/seed/store-crepe/600/400','https://picsum.photos/seed/logo-crepe/96/96',22,2500,true,4.6,'{Postres,Cafetería}',false),
  ('00000000-0000-0000-0000-000000000108','restaurant','Tacos Locos','tacos-locos','https://picsum.photos/seed/store-taco/600/400','https://picsum.photos/seed/logo-taco/96/96',18,3000,false,4.3,'{Mexicana}',false),
  ('00000000-0000-0000-0000-000000000201','market','Mercado La 80','mercado-la-80','https://picsum.photos/seed/store-market1/600/400','https://picsum.photos/seed/logo-market1/96/96',40,5000,false,4.5,'{Supermercado}',true),
  ('00000000-0000-0000-0000-000000000202','market','Express Verde','express-verde','https://picsum.photos/seed/store-market2/600/400','https://picsum.photos/seed/logo-market2/96/96',20,2000,true,4.2,'{"Tienda express",Frutas}',false),
  ('00000000-0000-0000-0000-000000000301','super_farma','FarmaPlus','farmaplus','https://picsum.photos/seed/store-farma/600/400','https://picsum.photos/seed/logo-farma/96/96',25,3000,false,4.4,'{Farmacia,Salud}',true),
  ('00000000-0000-0000-0000-000000000401','liquor_store','Vinos & Más','vinos-y-mas','https://picsum.photos/seed/store-liquor/600/400','https://picsum.photos/seed/logo-liquor/96/96',30,4000,false,4.6,'{Licores,Vinos}',false),
  ('00000000-0000-0000-0000-000000000501','turbo','TechStore Turbo','techstore-turbo','https://picsum.photos/seed/store-tech/600/400','https://picsum.photos/seed/logo-tech/96/96',45,6000,true,4.7,'{Tecnología,Gadgets}',true)
on conflict (slug) do nothing;

insert into public.products (store_id, name, description, price, compare_at_price, image_url, section, is_popular) values
  ('00000000-0000-0000-0000-000000000101','Hamburguesa Clásica Doble','Doble carne 200g, queso cheddar, tocino y salsa de la casa.',28900,35900,'https://picsum.photos/seed/p-doble/600/400','Hamburguesas',true),
  ('00000000-0000-0000-0000-000000000101','Crispy Chicken Burger','Pollo crocante, coleslaw y miel mostaza.',26900,null,'https://picsum.photos/seed/p-chicken/600/400','Hamburguesas',true),
  ('00000000-0000-0000-0000-000000000101','Papas a la Francesa Grandes','Porción generosa con sal de ajo.',9900,null,'https://picsum.photos/seed/p-papas/600/400','Complementos',false),
  ('00000000-0000-0000-0000-000000000101','Malteada de Oreo','Helado premium batido con galleta oreo.',12900,null,'https://picsum.photos/seed/p-shake/600/400','Bebidas',true),
  ('00000000-0000-0000-0000-000000000101','Combo Familiar x4','4 hamburguesas clásicas + 2 papas grandes + 4 gaseosas.',89900,105000,'https://picsum.photos/seed/p-combo/600/400','Combos',true),
  ('00000000-0000-0000-0000-000000000102','Croissant de Jamón y Queso','Recién horneado, mantequilla francesa.',8900,null,'https://picsum.photos/seed/p-croi/600/400','Panadería',true),
  ('00000000-0000-0000-0000-000000000102','Café Americano Grande','Origen Nariño, tueste medio.',6500,null,'https://picsum.photos/seed/p-cafe/600/400','Bebidas',true),
  ('00000000-0000-0000-0000-000000000102','Cheesecake de Maracuyá','Base de galleta y coulis de maracuyá.',13900,null,'https://picsum.photos/seed/p-cheese/600/400','Postres',false),
  ('00000000-0000-0000-0000-000000000102','Sándwich Pollo César','Pollo grillé, lechuga romana y aderezo césar.',18900,null,'https://picsum.photos/seed/p-caesar/600/400','Sándwiches',false),
  ('00000000-0000-0000-0000-000000000103','Pad Thai con Pollo','Fideos de arroz, maní, brotes y limón.',24900,null,'https://picsum.photos/seed/p-padthai/600/400','Asiática',true),
  ('00000000-0000-0000-0000-000000000103','Arroz Frito Especial','Con huevo, cerdo y vegetales salteados.',22900,null,'https://picsum.photos/seed/p-arroz/600/400','Asiática',false),
  ('00000000-0000-0000-0000-000000000103','Rolls de Primavera x6','Envueltos en papel de arroz con salsa dulce.',15900,null,'https://picsum.photos/seed/p-rolls/600/400','Entradas',false),
  ('00000000-0000-0000-0000-000000000104','Pizza Pepperoni Grande','Masa artesanal, mozzarella y pepperoni importado.',32900,39900,'https://picsum.photos/seed/p-pepperoni/600/400','Pizzas',true),
  ('00000000-0000-0000-0000-000000000104','Pizza Hawaiana','Jamón, piña y queso mozzarella.',30900,null,'https://picsum.photos/seed/p-hawaiana/600/400','Pizzas',false),
  ('00000000-0000-0000-0000-000000000104','Aros de Cebolla x10','Rebozado crocante con dip BBQ.',11900,null,'https://picsum.photos/seed/p-aros/600/400','Complementos',false),
  ('00000000-0000-0000-0000-000000000105','Alitas BBQ x12','Glaseado ahumado con sésamo.',27900,null,'https://picsum.photos/seed/p-alitas/600/400','Pollo',true),
  ('00000000-0000-0000-0000-000000000105','Alitas Picantes x12','Salsa habanero, nivel fuego.',27900,null,'https://picsum.photos/seed/p-alitas2/600/400','Pollo',true),
  ('00000000-0000-0000-0000-000000000105','Caja Papa x8','Pollo crocante con papas y ensalada.',33900,null,'https://picsum.photos/seed/p-caja/600/400','Pollo',false),
  ('00000000-0000-0000-0000-000000000106','Rollos California x8','Cangrejo, palta y masago.',26900,null,'https://picsum.photos/seed/p-cali/600/400','Sushi',true),
  ('00000000-0000-0000-0000-000000000106','Komodo Roll x8','Salmón flambeado, spicy mayo y cebollín.',34900,null,'https://picsum.photos/seed/p-komodo/600/400','Sushi',true),
  ('00000000-0000-0000-0000-000000000106','Tempura de Camarón','6 unidades con salsa tentsuyu.',21900,null,'https://picsum.photos/seed/p-tempura/600/400','Calientes',false),
  ('00000000-0000-0000-0000-000000000107','Waffle con Helado','Waffle belga, helado de vainilla y fresas.',18900,null,'https://picsum.photos/seed/p-waffle/600/400','Postres',true),
  ('00000000-0000-0000-0000-000000000107','Crepe Nutella','Crepe rellena de nutella y banana.',15900,null,'https://picsum.photos/seed/p-crepe/600/400','Postres',false),
  ('00000000-0000-0000-0000-000000000107','Limonada de Coco','Coco rallado, limón y hierbabuena.',9900,null,'https://picsum.photos/seed/p-limonada/600/400','Bebidas',false),
  ('00000000-0000-0000-0000-000000000108','Tacos al Pastor x3','Piña, cilantro y cebolla morada.',21900,null,'https://picsum.photos/seed/p-taco/600/400','Mexicana',true),
  ('00000000-0000-0000-0000-000000000108','Burrito Supremo','Carne asada, arroz, frijoles y guacamole.',24900,null,'https://picsum.photos/seed/p-burrito/600/400','Mexicana',false),
  ('00000000-0000-0000-0000-000000000108','Nachos con Guacamole','Totopos, queso fundido y pico de gallo.',16900,null,'https://picsum.photos/seed/p-nachos/600/400','Antojos',false),
  ('00000000-0000-0000-0000-000000000201','Leche Entera 1L','Pasteurizada.',5800,null,'https://picsum.photos/seed/p-leche/600/400','Lácteos',true),
  ('00000000-0000-0000-0000-000000000201','Huevos x12','Grado A, caja de 12 unidades.',12900,null,'https://picsum.photos/seed/p-huevo/600/400','Granja',true),
  ('00000000-0000-0000-0000-000000000201','Plátano Maduro x6','Selección maduro ideal para patacones.',4500,null,'https://picsum.photos/seed/p-platano/600/400','Frutas',false),
  ('00000000-0000-0000-0000-000000000201','Café Premium 500g','Molido, tueste oscuro, origen Colombia.',18900,22900,'https://picsum.photos/seed/p-cafebolsa/600/400','Despensa',true),
  ('00000000-0000-0000-0000-000000000202','Agua embotellada 2.5L','Sin gas.',4200,null,'https://picsum.photos/seed/p-agua/600/400','Bebidas',false),
  ('00000000-0000-0000-0000-000000000202','Doritos Nacho x2','Pack doble 160g.',11500,null,'https://picsum.photos/seed/p-doritos/600/400','Snacks',true),
  ('00000000-0000-0000-0000-000000000202','Avena Hojuelas 500g','Integral sin azúcar añadida.',7900,null,'https://picsum.photos/seed/p-avena/600/400','Despensa',false),
  ('00000000-0000-0000-0000-000000000301','Acetaminofén 500mg x20','Tabletas para el dolor y la fiebre.',6900,null,'https://picsum.photos/seed/p-para/600/400','Analgésicos',true),
  ('00000000-0000-0000-0000-000000000301','Vitamina C 1g x30','Efervescente sabor naranja.',15900,null,'https://picsum.photos/seed/p-vitic/600/400','Vitaminas',true),
  ('00000000-0000-0000-0000-000000000301','Protector Solar FPS 50','Toque seco, 120ml.',38900,45900,'https://picsum.photos/seed/p-solar/600/400','Cuidado personal',false),
  ('00000000-0000-0000-0000-000000000401','Cerveza Artesanal IPA 330ml','Edición limitada lúpulo cítrico.',12900,null,'https://picsum.photos/seed/p-cerveza/600/400','Cervecería',true),
  ('00000000-0000-0000-0000-000000000401','Vino Tinto Cabernet 750ml','Reserva, notas de frutos rojos.',58900,72000,'https://picsum.photos/seed/p-vino/600/400','Vinos',true),
  ('00000000-0000-0000-0000-000000000401','Whisky 12 años 700ml','Single malt importado.',189000,null,'https://picsum.photos/seed/p-whisky/600/400','Whisky',false),
  ('00000000-0000-0000-0000-000000000501','Audífonos Inalámbricos Pro','Cancelación de ruido activa, 30h batería.',149900,199900,'https://picsum.photos/seed/p-air/600/400','Audio',true),
  ('00000000-0000-0000-0000-000000000501','Smartwatch Fit S2','Monitor cardíaco, GPS y AMOLED.',129900,null,'https://picsum.photos/seed/p-watch/600/400','Wearables',true),
  ('00000000-0000-0000-0000-000000000501','Teclado Mecánico RGB','Switch red, layout ES.',89900,null,'https://picsum.photos/seed/p-key/600/400','Gaming',false);
