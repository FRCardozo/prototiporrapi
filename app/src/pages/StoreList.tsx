import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import StoreCard from '../components/StoreCard';
import { stores } from '../data/seed';

const TABS = [
  { id: 'restaurant', label: 'Restaurantes' },
  { id: 'market', label: 'Mercados' },
  { id: 'super_farma', label: 'Farmacia' },
  { id: 'turbo', label: 'Turbo' },
  { id: 'liquor_store', label: 'Licores' },
];

export default function StoreList() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');

  // /restaurantes -> restaurant; /tiendas/:tipo? -> market|super_farma|turbo|liquor_store; /tiendas -> todas no-restaurante
  const activeTab = params.tipo ?? searchParams.get('cat') ?? (params.kind === 'restaurantes' ? 'restaurant' : 'all');

  const list = useMemo(() => {
    let filtered = stores;
    if (activeTab === 'all') filtered = stores.filter((s) => s.categoryId !== 'restaurant');
    else if (activeTab !== 'none') filtered = stores.filter((s) => s.categoryId === activeTab || s.tags.join(' ').toLowerCase().includes(String(activeTab).toLowerCase()));
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter((s) => s.title.toLowerCase().includes(q) || s.tags.some((t) => t.toLowerCase().includes(q)));
    }
    return filtered.length ? filtered : stores;
  }, [activeTab, query]);

  const title =
    params.kind === 'restaurantes' ? 'Restaurantes con envío a domicilio' : activeTab === 'restaurant' ? 'Restaurantes' : 'Tiendas y mercados';

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-8">
      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold">
        {title}
      </motion.h1>
      <p className="mt-1 text-grayish">Descubre aliados con entrega rápida en tu zona.</p>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setQuery(query)} // mantiene estado; el tab activo se refleja en la URL real al navegar
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${
              activeTab === t.id ? 'bg-rappi text-white' : 'bg-frost text-grayish hover:bg-rappi-light hover:text-rappi'
            }`}
            disabled
          >
            {t.label}
          </button>
        ))}
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Filtrar ${title.toLowerCase()}…`}
        className="mt-4 w-full max-w-md rounded-full border border-line bg-frost px-5 py-2.5 text-sm outline-none focus:border-rappi focus:bg-white"
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <StoreCard store={s} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
