import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import type { Product } from '../types';
import { COP } from '../data/seed';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }: { product: Product }) {
  const { items, add, setQty } = useCart();
  const inCart = items.find((i) => i.product.id === product.id)?.qty ?? 0;
  const [pulse, setPulse] = useState(0);

  return (
    <div className="flex gap-4 rounded-2xl border border-line bg-white p-3 transition hover:shadow-md">
      <img src={product.image} alt={product.name} loading="lazy" className="h-24 w-24 shrink-0 rounded-xl object-cover" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold leading-tight text-ink">{product.name}</h3>
          {product.popular && <span className="shrink-0 rounded-full bg-rappi-light px-2 py-0.5 text-[10px] font-bold text-rappi">Popular</span>}
        </div>
        <p className="mt-1 line-clamp-2 text-xs text-grayish">{product.description}</p>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="font-extrabold text-ink">{COP(product.price)}</p>
            {product.compareAtPrice && <p className="text-xs text-grayish line-through">{COP(product.compareAtPrice)}</p>}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {inCart === 0 ? (
              <motion.button
                key="add"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => {
                  add(product);
                  setPulse((p) => p + 1);
                }}
                className="rounded-full border border-rappi px-4 py-1.5 text-sm font-bold text-rappi transition hover:bg-rappi hover:text-white"
              >
                Añadir
              </motion.button>
            ) : (
              <motion.div
                key="qty"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-3 rounded-full bg-rappi px-2 py-1 text-white"
              >
                <button onClick={() => setQty(product.id, inCart - 1)} aria-label="Quitar uno" className="grid h-6 w-6 place-items-center rounded-full transition hover:bg-white/20">
                  <Minus size={14} />
                </button>
                <motion.span key={pulse} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="w-4 text-center text-sm font-bold">
                  {inCart}
                </motion.span>
                <button onClick={() => setQty(product.id, inCart + 1)} aria-label="Agregar uno" className="grid h-6 w-6 place-items-center rounded-full transition hover:bg-white/20">
                  <Plus size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
