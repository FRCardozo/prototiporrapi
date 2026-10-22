import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Star } from 'lucide-react';
import type { Store } from '../types';
import { COP } from '../data/seed';

export default function StoreCard({ store }: { store: Store }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm"
    >
      <Link to={`/tienda/${store.slug}`} className="block">
        <div className="relative h-36 overflow-hidden">
          <img src={store.bgImage} alt={store.title} loading="lazy" className="h-full w-full object-cover transition duration-500 hover:scale-105" />
          {store.hasFreeShipping && (
            <span className="absolute left-2 top-2 rounded-full bg-mint px-2.5 py-1 text-[11px] font-bold text-white shadow">ENVÍO GRATIS</span>
          )}
        </div>
        <div className="p-3">
          <div className="flex items-center gap-3">
            <img src={store.logo} alt="" className="-mt-8 h-12 w-12 rounded-xl border-2 border-white object-cover shadow" />
            <div className="min-w-0">
              <h3 className="truncate font-bold text-ink">{store.title}</h3>
              <p className="text-xs text-grayish">{store.tags.join(' · ')}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs font-medium text-grayish">
            <span className="flex items-center gap-1">
              <Clock size={13} className="text-rappi" /> {store.eta}
            </span>
            <span className="flex items-center gap-1">
              <Star size={13} className="fill-yellow-400 text-yellow-400" /> {store.rating.toFixed(1)}
            </span>
            <span>{store.deliveryCost === 0 ? 'Gratis' : COP(store.deliveryCost)}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
