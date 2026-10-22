import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const cols = [
  { title: 'Empresa', links: [['Sobre nosotros', '/'], ['Trabaja con nosotros', '/'], ['Prensa', '/'], ['Blog', '/']] },
  { title: 'Para aliados', links: [['Sé un aliado', '/'], ['Sé un vanilla', '/'], ['Publica en RappiClone', '/']] },
  { title: 'Ayuda', links: [['Centro de ayuda', '/'], ['Términos y condiciones', '/'], ['Política de privacidad', '/']] },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-frost">
      <div className="mx-auto grid max-w-[1360px] gap-10 px-6 py-12 md:grid-cols-4">
        <div>
          <p className="text-2xl font-extrabold text-rappi">rappi</p>
          <p className="mt-3 max-w-xs text-sm text-grayish">
            Prototipo educativo inspirado en la arquitectura pública de rappi.com.co. Entregamos con amor ♥
          </p>
          <div className="mt-4 flex gap-3 text-grayish">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white transition hover:border-rappi hover:text-rappi">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="font-bold text-ink">{c.title}</h4>
            <ul className="mt-3 space-y-2">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-sm text-grayish transition hover:text-rappi">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-grayish">
        © {new Date().getFullYear()} RappiClone — prototipo sin afiliación con Rappi Inc.
      </div>
    </footer>
  );
}
