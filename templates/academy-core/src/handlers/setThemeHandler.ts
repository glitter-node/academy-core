const logger = ((window as any).G7Core?.createLogger?.('Template:academy-core:theme')) ?? {
  log: (...args: unknown[]) => console.log('[Template:academy-core:theme]', ...args),
  warn: (...args: unknown[]) => console.warn('[Template:academy-core:theme]', ...args),
  error: (...args: unknown[]) => console.error('[Template:academy-core:theme]', ...args),
};

export type ThemeMode = 'auto' | 'light' | 'dark';

const VALID_THEMES: ThemeMode[] = ['auto', 'light', 'dark'];
const STORAGE_KEY = 'g7_color_scheme';

const getEffectiveTheme = (mode: ThemeMode): 'light' | 'dark' => {
  if (mode === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  return mode;
};

const applyTheme = (mode: ThemeMode): void => {
  const effectiveTheme = getEffectiveTheme(mode);

  document.documentElement.setAttribute('data-theme', effectiveTheme);

  if (effectiveTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export function initTheme(): void {
  try {
    const savedTheme = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const theme = savedTheme && VALID_THEMES.includes(savedTheme) ? savedTheme : 'auto';

    applyTheme(theme);
    logger.log('Initial theme applied:', theme);
  } catch (error) {
    logger.warn('Failed to load initial theme:', error);
    applyTheme('auto');
  }
}

export async function initThemeHandler(action: any): Promise<void> {
  const targetTheme = action?.target;

  if (typeof targetTheme === 'string' && VALID_THEMES.includes(targetTheme as ThemeMode)) {
    applyTheme(targetTheme as ThemeMode);
    return;
  }

  initTheme();
}

export async function setThemeHandler(action: any): Promise<void> {
  const targetTheme = action?.target;

  if (typeof targetTheme !== 'string' || !VALID_THEMES.includes(targetTheme as ThemeMode)) {
    logger.warn('Unsupported theme:', targetTheme);
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, targetTheme);
  } catch (error) {
    logger.error('Failed to save theme to localStorage:', error);
    return;
  }

  applyTheme(targetTheme as ThemeMode);
  logger.log('Theme changed to:', targetTheme);
}
