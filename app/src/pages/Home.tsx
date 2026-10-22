import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock3, Headphones, Search as SearchIcon, Sparkles } from 'lucide-react';
import StoreCard from '../components/StoreCard';
import { banners, categories, stores, topSearchTerms } from '../data/seed';
import { useAuth } from '../context/AuthContext';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function Home() {
  const { user } = useAuth();
  const [showAll, setShowAll] = useState(false);
  const visibleCats = showAll ? categories : categories.slice(0, 6);
  const restaurants = stores.filter((s) => s.categoryId === 'restaurant');
  const markets = stores.filter((s) => s.categoryId !== 'restaurant');

  return (
    <div className="mx-auto max-w-[1360px] px-4">
      {/* HERO — replica la estructura del hero de rappi.com.co */}
      <section className="grid items-center gap-8 py-10 md:grid-cols-2 md:py-14">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-sm font-bold uppercase tracking-widest text-rappi">¡Pide todo en el mismo lugar!</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight text-ink md:text-5xl">
            Si tienes <span className="text-rappi">RappiClone,</span>
            <br />
            tienes <span className="underline decoration-mint decoration-4 underline-offset-4">Todo.</span>
          </h1>
          <p className="mt-4 max-w-md text-grayish">
            Ya no tienes que salir de tu casa u oficina para disfrutar lo mejor de tu ciudad. Restaurantes, mercados, farmacia y mucho más con entrega en minutos.
          </p>
          <form action="/buscar" className="relative mt-6 max-w-md">
            <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-grayish" />
            <input
              name="q"
              placeholder="¿Dónde quieres recibir tu compra o qué deseas pedir?"
              className="w-full rounded-full border border-line bg-white py-3 pl-11 pr-32 shadow-sm outline-none transition focus:border-rappi"
            />
            <button className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-rappi px-5 py-2 text-sm font-bold text-white transition hover:bg-rappi-dark">
              Buscar
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {topSearchTerms.map((t) => (
              <Link key={t} to={`/buscar?q=${encodeURIComponent(t)}`} className="rounded-full bg-frost px-3 py-1.5 text-xs font-medium text-grayish transition hover:bg-rappi-light hover:text-rappi">
                {t}
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative mx-auto w-full max-w-lg"
        >
          <div className="absolute -left-6 -top-6 hidden h-24 w-24 rounded-3xl bg-mint-light lg:block" />
          <div className="absolute -bottom-8 -right-6 hidden h-32 w-32 rounded-full bg-rappi-light lg:block" />
          <img src="https://picsum.photos/seed/hero-delivery/720/520" alt="Entrega a domicilio" className="relative z-10 w-full rounded-3xl object-cover shadow-xl" />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="absolute -bottom-5 left-6 z-20 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-lg"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-rappi text-white">🛵</span>
            <div>
              <p className="text-sm font-bold">Tu pedido va en camino</p>
              <p className="text-xs text-grayish">Llega en 14 min · Bogotá</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* CATEGORÍAS */}
      <section className="py-6" {...fadeUp}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold">{user ? `Hola, ${user.name}` : '¡Busca restaurantes y mucho más!'}</h2>
          <button onClick={() => setShowAll((v) => !v)} className="text-sm font-bold text-rappi hover:underline">
            {showAll ? 'Ver menos categorías' : 'Ver más categorías'}
          </button>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10">
          {visibleCats.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
              <Link to={c.url} className="group flex flex-col items-center gap-2 rounded-2xl border border-transparent p-2 text-center transition hover:border-line hover:bg-frost">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-frost text-2xl transition group-hover:scale-110 group-hover:bg-rappi-light">
                  {c.icon}
                </span>
                <span className="text-xs font-semibold text-ink">{c.title}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BANNERS PROMO */}
      <section className="grid gap-4 py-6 md:grid-cols-3" {...fadeUp}>
        {banners.map((b) => (
          <motion.div key={b.id} whileHover={{ scale: 1.02 }} className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${b.gradient} p-6 text-white shadow-md`}>
            <p className="text-3xl">{b.emoji}</p>
            <h3 className="mt-3 text-xl font-extrabold leading-snug">{b.title}</h3>
            <p className="mt-1 text-sm text-white/85">{b.subtitle}</p>
            <Link to={b.href} className="mt-4 inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink transition hover:gap-2">
              {b.cta} <ArrowRight size={15} />
            </Link>
          </motion.div>
        ))}
      </section>

      {/* TOP RESTAURANTES */}
      <section className="py-6" {...fadeUp}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold">Top restaurantes cerca de ti</h2>
          <Link to="/restaurantes" className="text-sm font-bold text-rappi hover:underline">Ver todos</Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {restaurants.slice(0, 8).map((s) => (
            <StoreCard key={s.id} store={s} />
          ))}
        </div>
      </section>

      {/* PROPUESTA DE VALOR (sección "vp" del sitio real) */}
      <section className="my-10 rounded-3xl bg-ink px-6 py-12 text-white" {...fadeUp}>
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-mint">¡Tú a lo tuyo y lo demás déjaselo a RappiClone!</p>
          <h2 className="mt-2 text-3xl font-extrabold">Es hora del delicioso todo</h2>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { icon: Sparkles, title: '¡Ahorra tiempo!', text: 'Corremos para hacerte la vida más fácil. Sigue en tus actividades del día a día que nosotros nos encargamos del resto.' },
            { icon: Clock3, title: 'Trabajamos las 24 horas', text: 'Soporte 24/7 y una gran oferta de restaurantes y aliados con servicio las 24 horas.' },
            { icon: Headphones, title: '¡Encuentras de todo!', text: 'Comida, mercado, farmacia, tecnología, licores y mucho más en una sola app.' },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl bg-white/5 p-6 backdrop-blur transition hover:bg-white/10">
              <f.icon className="text-mint" size={28} />
              <h3 className="mt-3 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-white/70">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TIENDAS / MERCADO */}
      <section className="py-6" {...fadeUp}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold">Grandes marcas en RappiClone</h2>
          <Link to="/tiendas" className="text-sm font-bold text-rappi hover:underline">Ver todas</Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {markets.map((s) => (
            <StoreCard key={s.id} store={s} />
          ))}
        </div>
      </section>
    </div>
  );
}
