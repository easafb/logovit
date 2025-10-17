import { useEffect } from 'react';
import { PALETTE } from '../palette';

export function useThemeVars(darkMode: boolean) {
  useEffect(() => {
    const p = darkMode ? PALETTE.dark : PALETTE.light;
    const root = document.documentElement;
    root.style.setProperty('--orange-base', p.orange.base);
    root.style.setProperty('--orange-hover', p.orange.hover);
    root.style.setProperty('--orange-ring', p.orange.ring);
    root.style.setProperty('--text-primary', p.text.primary);
    root.style.setProperty('--text-muted', p.text.muted);
    root.style.setProperty('--line-color', p.line);
    root.style.setProperty('--card-bg', p.card);
    root.style.setProperty('--soft-bg', p.soft);
    root.style.setProperty('--page-bg', p.page);
  }, [darkMode]);
}
