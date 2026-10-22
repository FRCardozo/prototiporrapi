import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PackageOpen } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import StoreCard from '../components/StoreCard';
import { getStoreById, products, stores, topSearchTerms } from '../data/seed';

export default function Search() {
  const [sp] = useSearchParams();
  const q = (sp.get('q') ?? '').trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return { storesList: stores, productsList: [] };
    const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const storesList = stores.filter(
      (s) => norm(s.title).includes(norm(q)) || s.tags.some((t) => norm(t).includes(norm(q))),
    );
    const productsList = products.filter(
      (p) => norm(p.name).includes(norm(q)) || norm(p.description).includes(norm(q)) || norm(p.category).includes(norm(q)),
    );
    return { storesList, productsList };
  }, [q]);

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-8">
      <h1 className="text-2xl font-extrabold">
        {q ? <>Resultados para “<span className="text-rappi">{q}</span>”</> : 'Búsqueda'}
      </h1>

      {!q && (
        <div className="mt-4 flex flex-wrap gap-2">
          {topSearchTerms.map((t) => (
            <Link key={t} to={`/buscar?q=${encodeURIComponent(t)}`} className="rounded-full bg-frost px-4 py-2 text-sm font-medium text-grayish transition hover:bg-rappi-light hover:text-rappi">
              {t}
            </Link>
          ))}
        </div>
      )}

      {results.storesList.length > 0 && (
        <>
          <h2 className="mt-8 text-xl font-bold">Tiendas</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {results.storesList.slice(0, 8).map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <StoreCard store={s} />
              </motion.div>
            ))}
          </div>
        </>
      )}

      {results.productsList.length > 0 && (
        <>
          <h2 className="mt-10 text-xl font-bold">Productos</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {results.productsList.map((p) => (
              <div key={p.id}>
                <ProductCard product={p} />
                <Link to={`/tienda/${getStoreById(p.storeId)?.slug ?? ''}`} className="mt-1 block text-xs font-semibold text-rappi hover:underline">
                  en {getStoreById(p.storeId)?.title}
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      {q && results.storesList.length === 0 && results.productsList.length === 0 && (
        <div className="mt-16 flex flex-col items-center text-center text-grayish">
          <PackageOpen size={48} className="text-line" />
          <p className="mt-3 font-bold text-ink">No encontramos resultados para “{q}”</p>
          <p className="text-sm">Prueba con términos como hamburguesa, pizza o mercado.</p>
        </div>
      )}
    </div>
  );
}
