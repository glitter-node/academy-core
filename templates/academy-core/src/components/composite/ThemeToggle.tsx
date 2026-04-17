import React, { useEffect, useId, useRef, useState } from "react";

type ThemeMode = "auto" | "light" | "dark";

type ThemeToggleProps = {
  className?: string;
  autoText?: string;
  lightText?: string;
  darkText?: string;
};

const STORAGE_KEY = "g7_color_scheme";
const VALID_THEMES: ThemeMode[] = ["auto", "light", "dark"];
const THEME_OPTIONS: ThemeMode[] = ["auto", "light", "dark"];
const getThemeLabels = ({ autoText, lightText, darkText }: ThemeToggleProps): Record<ThemeMode, string> => ({
  auto: autoText || "System",
  light: lightText || "Light",
  dark: darkText || "Dark",
});

const getEffectiveTheme = (mode: ThemeMode): "light" | "dark" => {
  if (mode === "auto") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  return mode;
};

const applyTheme = (mode: ThemeMode) => {
  const effectiveTheme = getEffectiveTheme(mode);

  document.documentElement.setAttribute("data-theme", effectiveTheme);
  document.documentElement.classList.toggle("dark", effectiveTheme === "dark");
};

const getStoredTheme = (): ThemeMode => {
  try {
    const savedTheme = window.localStorage.getItem(STORAGE_KEY);
    if (savedTheme && VALID_THEMES.includes(savedTheme as ThemeMode)) {
      return savedTheme as ThemeMode;
    }
  } catch {
    return "auto";
  }

  return "auto";
};

const ThemeToggle = ({
  className = "",
  autoText,
  lightText,
  darkText,
}: ThemeToggleProps) => {
  const [mode, setMode] = useState<ThemeMode>(() => getStoredTheme());
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<Record<ThemeMode, HTMLButtonElement | null>>({
    auto: null,
    light: null,
    dark: null,
  });
  const menuId = useId();
  const labelMap = getThemeLabels({ autoText, lightText, darkText });

  useEffect(() => {
    const initialMode = getStoredTheme();
    setMode(initialMode);
    applyTheme(initialMode);
  }, []);

  useEffect(() => {
    if (mode !== "auto") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme("auto");

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [mode]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      itemRefs.current[mode]?.focus();
    }
  }, [isOpen, mode]);

  const handleClick = (nextMode: ThemeMode) => {
    setMode(nextMode);

    try {
      window.localStorage.setItem(STORAGE_KEY, nextMode);
    } catch {
      return;
    }

    applyTheme(nextMode);

    const dispatcher = (window as any).G7Core?.dispatch;
    if (typeof dispatcher === "function") {
      dispatcher({ handler: "setTheme", target: nextMode });
    }

    setIsOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const rootClassName = ["ac-theme-toggle", className].filter(Boolean).join(" ");
  const activeLabel = labelMap[mode];

  const focusOption = (nextMode: ThemeMode) => {
    itemRefs.current[nextMode]?.focus();
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen(true);
    }
  };

  const handleItemKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, currentMode: ThemeMode) => {
    const currentIndex = THEME_OPTIONS.indexOf(currentMode);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % THEME_OPTIONS.length;
      focusOption(THEME_OPTIONS[nextIndex]);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex = (currentIndex - 1 + THEME_OPTIONS.length) % THEME_OPTIONS.length;
      focusOption(THEME_OPTIONS[nextIndex]);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusOption(THEME_OPTIONS[0]);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusOption(THEME_OPTIONS[THEME_OPTIONS.length - 1]);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div className={rootClassName} ref={rootRef}>
      <button
        type="button"
        ref={triggerRef}
        className={`ac-theme-toggle__trigger${isOpen ? " is-open" : ""}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className="ac-theme-toggle__trigger-label">{activeLabel}</span>
        <span className="ac-theme-toggle__trigger-icon" aria-hidden="true">
          ▾
        </span>
      </button>

      {isOpen ? (
        <div className="ac-theme-toggle__panel" id={menuId} role="menu" aria-label="Theme options">
          {THEME_OPTIONS.map((option) => {
            const isActive = mode === option;

            return (
              <button
                key={option}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                className={`ac-theme-toggle__item${isActive ? " is-active" : ""}`}
                onClick={() => handleClick(option)}
                onKeyDown={(event) => handleItemKeyDown(event, option)}
                ref={(element) => {
                  itemRefs.current[option] = element;
                }}
              >
                <span>{labelMap[option]}</span>
                <span className="ac-theme-toggle__item-check" aria-hidden="true">
                  {isActive ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default ThemeToggle;
