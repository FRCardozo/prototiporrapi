import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MapPin, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { COP, getProductsByStore, getStoreBySlug } from '../data/seed';

export default function StoreDetail() {
  const { slug } = useParams();
  const store = slug ? getStoreBySlug(slug) : undefined;
  const items = useMemo(() => (store ? getProductsByStore(store.id) : []), [store]);
  const sections = useMemo(() => {
    const map = new Map<string, typeof items>();
    for (const p of items) map.set(p.category, [...(map.get(p.category) ?? []), p]);
    return [...map.entries()];
  }, [items]);
  const [active, setActive] = useState(0);

  if (!store) {
    return (
      <div className="mx-auto max-w-[1360px] px-4 py-20 text-center">
        <h1 className="text-2xl font-extrabold">Tienda no encontrada</h1>
        <p className="mt-2 text-grayish">Puede que el enlace haya cambiado o la tienda ya no esté disponible.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1360px] px-4 pb-16">
      {/* Portada */}
      <div className="relative mt-6 h-48 overflow-hidden rounded-3xl md:h-64">
        <img src={store.bgImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-5 left-6 flex items-end gap-4">
          <img src={store.logo} alt="" className="h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-lg" />
          <div className="text-white">
            <h1 className="text-2xl font-extrabold md:text-3xl">{store.title}</h1>
            <p className="text-sm opacity-90">{store.tags.join(' · ')}</p>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-5 flex flex-wrap gap-6 text-sm font-medium text-grayish">
        <span className="flex items-center gap-1.5"><Clock size={16} className="text-rappi" /> Entrega en {store.eta}</span>
        <span className="flex items-center gap-1.5"><Star size={16} className="fill-yellow-400 text-yellow-400" /> {store.rating.toFixed(1)} calificación</span>
        <span className="flex items-center gap-1.5"><MapPin size={16} className="text-mint-dark" /> Bogotá, Colombia</span>
        <span className="flex items-center gap-1.5">🛵 Envío {store.deliveryCost === 0 ? 'gratis' : COP(store.deliveryCost)}</span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Navegación de secciones estilo menú real */}
        <nav className="hidden lg:block">
          <div className="sticky top-24 space-y-1">
            {sections.map(([name], i) => (
              <button
                key={name}
                onClick={() => document.getElementById(`sec-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className={`block w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition ${
                  active === i ? 'bg-rappi-light text-rappi' : 'text-grayish hover:bg-frost'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </nav>

        <div className="space-y-10">
          {sections.map(([name, list], i) => (
            <section
              key={name}
              id={`sec-${i}`}
              className="scroll-mt-24"
              onScroll={() => setActive(i)}
            >
              <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xl font-extrabold">
                {name}
              </motion.h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {list.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
