'use client';

import { useTheme } from '@/context/ThemeContext';

type ThemeToggleProps = {
  label?: boolean;
  className?: string;
};

export default function ThemeToggle({ label = false, className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';
  const title = isLight ? 'Switch to dark mode' : 'Switch to light mode';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center gap-2 text-primary transition-all duration-150 hover:opacity-80 active:scale-95 cursor-pointer ${className}`}
      aria-label={title}
      title={title}
    >
      <span className="material-symbols-outlined">
        {isLight ? 'dark_mode' : 'light_mode'}
      </span>
      {label && (
        <span className="font-label-caps text-[10px] uppercase tracking-wider">
          {isLight ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
}
