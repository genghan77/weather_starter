import { useEffect, useState } from 'react';
import { CloseIcon } from './icons';

const THEMES = [
  { id: 'classic-blue', label: 'Classic Blue' },
  { id: 'apple', label: 'Apple' },
  { id: 'midnight', label: 'Midnight' },
  { id: 'sunrise', label: 'Sunrise' },
  { id: 'minimal', label: 'Minimal' },
];

const STORAGE_KEY = 'weather-starter:theme';

export function ThemeSelector() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? 'apple';
    } catch {
      return 'apple';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  return (
    <div className="absolute right-4 top-4 z-50">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/85 backdrop-blur-xl hover:bg-white/[0.12]"
        >
          Theme: {THEMES.find((t) => t.id === theme)?.label ?? theme}
        </button>

        {open && (
          <div className="mt-2 w-44 rounded-md border border-white/10 bg-slate-950/95 p-2 shadow-lg">
            <div className="flex items-center justify-between px-1 pb-2">
              <strong className="text-xs text-white/85">Theme</strong>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-white/70 hover:text-white"
                aria-label="Close"
              >
                <CloseIcon className="h-3.5 w-3.5" />
              </button>
            </div>
            <ul className="space-y-1">
              {THEMES.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setTheme(t.id);
                      setOpen(false);
                    }}
                    className={`w-full rounded px-2 py-1 text-left text-sm font-medium transition hover:bg-white/[0.04] ${
                      theme === t.id ? 'text-white' : 'text-white/70'
                    }`}
                  >
                    {t.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ThemeSelector;
