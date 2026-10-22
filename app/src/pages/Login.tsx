import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Loader2, Lock, Mail, User2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn, signUp, mode } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const err = isRegister ? await signUp(name || email.split('@')[0], email, password) : await signIn(email, password);
    setLoading(false);
    if (err) setError(err);
    else navigate('/');
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-14">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
        <div className="mb-8 flex flex-col items-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rappi text-white shadow-lg shadow-rappi/30">
            <Heart size={26} fill="currentColor" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold">{isRegister ? 'Crea tu cuenta' : 'Inicia sesión'}</h1>
          <p className="mt-1 text-sm text-grayish">
            {mode === 'demo' ? 'Modo demo: se guardará localmente sin backend.' : 'Conecta tu cuenta Supabase para usar autenticación real.'}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-line bg-white p-6 shadow-sm">
          {isRegister && (
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase text-grayish">Nombre</span>
              <div className="relative">
                <User2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-grayish" />
                <input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} placeholder="Tu nombre" className="w-full rounded-xl border border-line bg-frost py-3 pl-10 pr-3 text-sm outline-none focus:border-rappi" />
              </div>
            </label>
          )}
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase text-grayish">Correo electrónico</span>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-grayish" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="tu@correo.com" className="w-full rounded-xl border border-line bg-frost py-3 pl-10 pr-3 text-sm outline-none focus:border-rappi" />
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase text-grayish">Contraseña</span>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-grayish" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="Mínimo 6 caracteres" className="w-full rounded-xl border border-line bg-frost py-3 pl-10 pr-3 text-sm outline-none focus:border-rappi" />
            </div>
          </label>

          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}

          <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-rappi py-3 font-bold text-white transition hover:bg-rappi-dark disabled:opacity-60">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {isRegister ? 'Registrarme' : 'Continuar'}
          </button>

          <p className="text-center text-sm text-grayish">
            {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
            <button type="button" onClick={() => setIsRegister((v) => !v)} className="font-bold text-rappi hover:underline">
              {isRegister ? 'Inicia sesión' : 'Regístrate'}
            </button>
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-grayish">
          ¿Prefieres seguir explorando? <Link to="/" className="font-bold text-rappi hover:underline">Ir al inicio</Link>
        </p>
      </motion.div>
    </div>
  );
}
