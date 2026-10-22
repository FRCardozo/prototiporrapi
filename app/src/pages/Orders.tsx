import { useEffect, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ChefHat, PackageOpen, Rocket, Store } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { nextStatusLabel, useOrders } from '../hooks/useOrders';
import { COP } from '../data/seed';
import type { OrderStatus } from '../types';

const STEPS: { id: OrderStatus; label: string; icon: typeof Store }[] = [
  { id: 'confirmado', label: 'Confirmado', icon: CheckCircle2 },
  { id: 'en_preparacion', label: 'En preparación', icon: ChefHat },
  { id: 'en_camino', label: 'En camino', icon: Rocket },
  { id: 'entregado', label: 'Entregado', icon: Store },
];

export default function Orders() {
  const { orders } = useOrders();
  const [sp] = useSearchParams();
  const justPlaced = sp.get('nuevo') === '1';
  const seenRef = useRef(false);

  useEffect(() => {
    seenRef.current = true;
  }, []);

  const active = orders.find((o) => o.status !== 'entregado' && o.status !== 'cancelado');
  const stepIndex = active ? STEPS.findIndex((s) => s.id === active.status) : -1;

  // ─── Datos para Recharts ─────────────────────────────────────────────
  const totalsByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      map.set(d.toLocaleDateString('es-CO', { weekday: 'short' }), 0);
    }
    for (const o of orders) {
      const k = new Date(o.createdAt).toLocaleDateString('es-CO', { weekday: 'short' });
      if (map.has(k)) map.set(k, (map.get(k) ?? 0) + o.total);
    }
    return [...map.entries()].map(([day, total]) => ({ day, total }));
  }, [orders]);

  const byStore = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of orders) map.set(o.storeTitle, (map.get(o.storeTitle) ?? 0) + 1);
    return [...map.entries()].map(([store, count]) => ({ store, count }));
  }, [orders]);

  const statusData = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of orders) map.set(o.status, (map.get(o.status) ?? 0) + 1);
    return [...map.entries()].map(([status, value]) => ({ name: status, value }));
  }, [orders]);

  const COLORS = ['#ff441f', '#29d884', '#5e00be', '#ffb02e', '#6a696e'];
  const spent = orders.reduce((a, o) => a + o.total, 0);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10">
      <h1 className="text-3xl font-extrabold">Mis pedidos</h1>
      <p className="mt-1 text-grayish">Seguimiento en tiempo real y estadísticas de tus compras.</p>

      {justPlaced && active && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-2xl border border-mint bg-mint-light p-4 font-semibold text-mint-dark">
          ¡Pedido realizado con éxito! Tu vanilla está listo para rodar 🛵
        </motion.div>
      )}

      {/* Tracking activo */}
      {active && (
        <section className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img src={active.storeImage} alt="" className="h-12 w-12 rounded-xl object-cover" />
              <div>
                <p className="font-bold">{active.storeTitle}</p>
                <p className="text-xs text-grayish">{new Date(active.createdAt).toLocaleString('es-CO')} · {active.address}</p>
              </div>
            </div>
            <span className="rounded-full bg-rappi-light px-3 py-1 text-sm font-bold text-rappi">{nextStatusLabel[active.status]}</span>
          </div>

          <div className="relative mt-8 grid grid-cols-4">
            <div className="absolute left-0 right-0 top-5 h-1 rounded bg-line" />
            <motion.div
              className="absolute left-0 top-5 h-1 rounded bg-rappi"
              initial={{ width: 0 }}
              animate={{ width: `${(Math.max(stepIndex, 0) / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.8 }}
            />
            {STEPS.map((s, i) => (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                <motion.span
                  animate={i === stepIndex ? { scale: [1, 1.15, 1] } : {}}
                  transition={i === stepIndex ? { repeat: Infinity, duration: 1.6 } : {}}
                  className={`grid h-11 w-11 place-items-center rounded-full border-4 border-white shadow ${
                    i <= stepIndex ? 'bg-rappi text-white' : 'bg-frost text-grayish'
                  }`}
                >
                  <s.icon size={18} />
                </motion.span>
                <span className={`text-[11px] font-bold ${i <= stepIndex ? 'text-ink' : 'text-grayish'}`}>{s.label}</span>
              </div>
            ))}
          </div>

          <ul className="mt-6 space-y-1 border-t border-line pt-4 text-sm">
            {active.items.map((it, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{it.qty}× {it.name}</span>
                <span className="font-semibold">{COP(it.qty * it.price)}</span>
              </li>
            ))}
            <li className="flex justify-between pt-2 font-extrabold">
              <span>Total</span>
              <span className="text-rappi">{COP(active.total)}</span>
            </li>
          </ul>
        </section>
      )}

      {/* Gráficas */}
      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-line bg-white p-5">
          <h2 className="font-extrabold">Gasto de los últimos 7 días</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={totalsByDay}>
                <defs>
                  <linearGradient id="gRappi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff441f" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#ff441f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6ebf1" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={56} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => COP(Number(v))} />
                <Area type="monotone" dataKey="total" stroke="#ff441f" strokeWidth={2.5} fill="url(#gRappi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-white p-5">
          <h2 className="font-extrabold">Pedidos por aliado</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byStore} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6ebf1" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="store" width={110} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} fill="#29d884" barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-white p-5">
          <h2 className="font-extrabold">Estado del histórico</h2>
          <div className="mt-4 h-56">
            {statusData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={4}>
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Empty minis />
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-3xl bg-gradient-to-br from-rappi to-[#ff7a4d] p-6 text-white">
          <p className="text-sm font-bold uppercase tracking-wide opacity-90">Total gastado en RappiClone</p>
          <p className="mt-2 text-4xl font-extrabold">{COP(spent)}</p>
          <p className="mt-2 text-sm opacity-90">{orders.length} pedido{orders.length === 1 ? '' : 's'} · ahorro de tiempo estimado: {orders.length * 42} min 🎉</p>
        </div>
      </section>

      {/* Histórico */}
      <section className="mt-10">
        <h2 className="text-xl font-extrabold">Historial</h2>
        {orders.length === 0 ? (
          <div className="mt-6 flex flex-col items-center rounded-3xl border border-dashed border-line py-16 text-center">
            <PackageOpen size={44} className="text-line" />
            <p className="mt-3 font-bold">Aún no tienes pedidos</p>
            <Link to="/restaurantes" className="mt-4 rounded-full bg-rappi px-5 py-2.5 text-sm font-bold text-white hover:bg-rappi-dark">
              Pedir ahora
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {orders.map((o) => (
              <li key={o.id} className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4">
                <img src={o.storeImage} alt="" className="h-12 w-12 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{o.storeTitle}</p>
                  <p className="text-xs text-grayish">{o.items.reduce((a, i) => a + i.qty, 0)} productos · {new Date(o.createdAt).toLocaleDateString('es-CO')}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${o.status === 'entregado' ? 'bg-mint-light text-mint-dark' : o.status === 'cancelado' ? 'bg-red-50 text-red-500' : 'bg-rappi-light text-rappi'}`}>
                  {o.status.replaceAll('_', ' ')}
                </span>
                <span className="font-extrabold">{COP(o.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Empty({ minis }: { minis?: boolean }) {
  return (
    <div className={`grid h-full place-items-center text-sm text-grayish ${minis ? '' : 'py-10'}`}>
      Haz tu primer pedido para ver gráficas 📊
    </div>
  );
}
