import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, LogOut, MapPin, Menu, Search, ShoppingBag, User2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { topSearchTerms } from '../data/seed';

export default function Header() {
  const { user, logout, mode } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [address, setAddress] = useState<string>(localStorage.getItem('rappiclone.address') ?? 'Bogotá, Colombia');

  const submitSearch = (term: string) => {
    setMenuOpen(false);
    navigate(`/buscar?q=${encodeURIComponent(term)}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1360px] items-center gap-4 px-4">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-1.5" aria-label="Ir al inicio">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-rappi text-white">
            <Heart size={18} fill="currentColor" />
          </span>
          <span className="hidden text-2xl font-extrabold tracking-tight text-rappi sm:block">rappi</span>
        </Link>

        {/* Selector de dirección */}
        <button
          onClick={() => {
            const v = window.prompt('¿Dónde quieres recibir tu compra?', address);
            if (v) {
              setAddress(v);
              localStorage.setItem('rappiclone.address', v);
            }
          }}
          className="hidden min-w-0 items-center gap-1.5 rounded-full border border-line px-3 py-2 text-sm text-grayish transition hover:border-rappi md:flex"
        >
          <MapPin size={16} className="shrink-0 text-rappi" />
          <span className="truncate">{address}</span>
        </button>

        {/* Buscador */}
        <form
          className="relative hidden flex-1 md:block"
          onSubmit={(e) => {
            e.preventDefault();
            submitSearch(q);
          }}
        >
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-grayish" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="¿Qué deseas pedir? Restaurantes, mercados, tiendas…"
            className="w-full rounded-full border border-line bg-frost py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-rappi focus:bg-white"
          />
        </form>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <NavLink to="/mis-pedidos" className="hidden rounded-full px-3 py-2 text-sm font-semibold text-ink transition hover:bg-frost lg:block">
            Mis pedidos
          </NavLink>

          {user ? (
            <div className="hidden items-center gap-2 lg:flex">
              <span className="max-w-[140px] truncate text-sm font-semibold text-ink">Hola, {user.name}</span>
              <button onClick={() => void logout()} title="Cerrar sesión" className="grid h-9 w-9 place-items-center rounded-full border border-line text-grayish transition hover:border-rappi hover:text-rappi">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-full bg-rappi px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-rappi-dark lg:block"
            >
              Iniciar sesión
            </Link>
          )}

          <Link to="/carrito" className="relative grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition hover:border-rappi hover:text-rappi">
            <ShoppingBag size={18} />
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.4 }}
                animate={{ scale: 1 }}
                className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-mint px-1 text-[11px] font-bold text-white"
              >
                {count}
              </motion.span>
            )}
          </Link>

          <button className="grid h-10 w-10 place-items-center rounded-full border border-line lg:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menú">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line bg-white lg:hidden"
          >
            <div className="space-y-3 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitSearch(q || '');
                }}
                className="relative"
              >
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-grayish" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="¿Qué deseas pedir?"
                  className="w-full rounded-full border border-line bg-frost py-2.5 pl-11 pr-4 text-sm outline-none focus:border-rappi"
                />
              </form>
              <div className="flex flex-wrap gap-2">
                {topSearchTerms.slice(0, 5).map((t) => (
                  <button key={t} onClick={() => submitSearch(t)} className="rounded-full bg-frost px-3 py-1.5 text-xs font-medium text-grayish">
                    {t}
                  </button>
                ))}
              </div>
              <Link to="/mis-pedidos" onClick={() => setMenuOpen(false)} className="block rounded-lg px-2 py-2 text-sm font-semibold">Mis pedidos</Link>
              {user ? (
                <button
                  onClick={() => {
                    void logout();
                    setMenuOpen(false);
                  }}
                  className="block w-full rounded-lg px-2 py-2 text-left text-sm font-semibold text-rappi"
                >
                  Cerrar sesión ({user.name})
                </button>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg bg-rappi px-3 py-2.5 text-sm font-bold text-white">
                  <User2 size={16} /> Iniciar sesión {mode === 'demo' ? '(modo demo)' : ''}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
