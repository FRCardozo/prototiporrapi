import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { COP, getStoreById } from '../data/seed';

const PAYMENTS = [
  { id: 'card', label: 'Tarjeta registrada', desc: 'Visa •••• 4242', emoji: '💳' },
  { id: 'cash', label: 'Efectivo', desc: 'Paga al recibir', emoji: '💵' },
  { id: 'pse', label: 'PSE', desc: 'Débito bancario', emoji: '🏦' },
  { id: 'nequi', label: 'Nequi', desc: 'Pago con app', emoji: '📱' },
];

export default function Cart() {
  const { items, subtotal, setQty, remove, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payment, setPayment] = useState('card');
  const [placing, setPlacing] = useState(false);

  const deliveryFee = subtotal >= 60000 ? 0 : 4900;
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + serviceFee;
  const storeIds = [...new Set(items.map((i) => i.product.storeId))];

  const checkout = async () => {
    setPlacing(true);
    // Orden por tienda (igual que Rappi agrupa despachadores por aliado)
    const ordersData = storeIds.map((sid) => {
      const store = getStoreById(sid)!;
      const its = items.filter((i) => i.product.storeId === sid);
      return {
        storeTitle: store.title,
        storeImage: store.logo,
        items: its.map((i) => ({ name: i.product.name, qty: i.qty, price: i.product.price })),
        total: its.reduce((a, i) => a + i.qty * i.product.price, 0) + deliveryFee + serviceFee,
        address: localStorage.getItem('rappiclone.address') ?? 'Bogotá, Colombia',
        userId: user?.id ?? 'guest',
      };
    });
    // Guardado directo (misma clave que useOrders)
    const all = JSON.parse(localStorage.getItem('rappiclone.orders') ?? '[]');
    for (const o of ordersData) {
      all.push({ ...o, id: crypto.randomUUID(), status: 'confirmado', createdAt: new Date().toISOString(), userId: user?.id ?? 'local' });
    }
    localStorage.setItem('rappiclone.orders', JSON.stringify(all));
    clear();
    navigate('/mis-pedidos?nuevo=1');
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <motion.span initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="grid h-24 w-24 place-items-center rounded-full bg-frost text-grayish">
          <ShoppingBag size={40} />
        </motion.span>
        <h1 className="mt-6 text-2xl font-extrabold">Tu carrito está vacío</h1>
        <p className="mt-2 text-grayish">Aún no has agregado productos. Explora restaurantes y tiendas cerca de ti.</p>
        <Link to="/restaurantes" className="mt-6 rounded-full bg-rappi px-6 py-3 font-bold text-white transition hover:bg-rappi-dark">
          Descubrir restaurantes
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-[1100px] gap-8 px-4 py-10 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="text-2xl font-extrabold">Carrito ({items.length} productos)</h1>
        <AnimatePresence>
          {items.map((i) => (
            <motion.div
              key={i.product.id}
              layout
              exit={{ opacity: 0, x: -60 }}
              className="mt-4 flex items-center gap-4 rounded-2xl border border-line bg-white p-3"
            >
              <img src={i.product.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{i.product.name}</p>
                <p className="text-xs text-grayish">{getStoreById(i.product.storeId)?.title} · {COP(i.product.price)}</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-line px-2 py-1">
                <button onClick={() => setQty(i.product.id, i.qty - 1)} className="grid h-6 w-6 place-items-center rounded-full hover:bg-frost"><Minus size={13} /></button>
                <span className="w-5 text-center text-sm font-bold">{i.qty}</span>
                <button onClick={() => setQty(i.product.id, i.qty + 1)} className="grid h-6 w-6 place-items-center rounded-full hover:bg-frost"><Plus size={13} /></button>
              </div>
              <button onClick={() => remove(i.product.id)} aria-label="Eliminar" className="grid h-8 w-8 place-items-center rounded-full text-grayish transition hover:bg-red-50 hover:text-red-500">
                <Trash2 size={15} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="mt-6">
          <h2 className="font-bold">Método de pago</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {PAYMENTS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPayment(p.id)}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                  payment === p.id ? 'border-rappi bg-rappi-light' : 'border-line bg-white hover:border-grayish'
                }`}
              >
                <span className="text-xl">{p.emoji}</span>
                <span>
                  <span className="block text-sm font-bold">{p.label}</span>
                  <span className="block text-xs text-grayish">{p.desc}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resumen sticky */}
      <aside className="h-fit rounded-3xl border border-line bg-white p-6 shadow-sm lg:sticky lg:top-24">
        <h2 className="text-lg font-extrabold">Resumen</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-grayish">Subtotal</dt><dd className="font-semibold">{COP(subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-grayish">Costo de despacho</dt><dd className="font-semibold">{deliveryFee === 0 ? 'Gratis' : COP(deliveryFee)}</dd></div>
          <div className="flex justify-between"><dt className="text-grayish">Servicio</dt><dd className="font-semibold">{COP(serviceFee)}</dd></div>
          <div className="flex justify-between border-t border-line pt-3 text-base"><dt className="font-extrabold">Total</dt><dd className="font-extrabold text-rappi">{COP(total)}</dd></div>
        </dl>
        {!user && (
          <p className="mt-4 rounded-xl bg-frost p-3 text-xs text-grayish">
            Inicia sesión para guardar tus pedidos y hacer seguimiento en tiempo real.{' '}
            <Link to="/login" className="font-bold text-rappi hover:underline">Entrar</Link>
          </p>
        )}
        <button
          onClick={() => void checkout()}
          disabled={placing}
          className="mt-5 w-full rounded-full bg-rappi py-3.5 font-bold text-white shadow-lg shadow-rappi/25 transition hover:bg-rappi-dark disabled:opacity-60"
        >
          {placing ? 'Creando pedido…' : `Pedir ${storeIds.length > 1 ? `${storeIds.length} tiendas` : ''} · ${COP(total)}`}
        </button>
        <p className="mt-3 text-center text-[11px] text-grayish">Al pedir aceptas los términos del prototipo. Pago simulado, no real.</p>
      </aside>
    </div>
  );
}
