import { NavLink } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Navbar() {
  const { dark, toggle } = useTheme();

  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-6">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`
          }
        >
          Evaluación
        </NavLink>
        <NavLink
          to="/historial"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`
          }
        >
          Historial
        </NavLink>
      </div>

      <button
        onClick={toggle}
        title={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        className="p-2 rounded-lg text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-150"
      >
        {dark ? <SunIcon /> : <MoonIcon />}
      </button>
    </nav>
  );
}
