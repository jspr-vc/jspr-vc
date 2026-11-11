"use client";

/*
 * The theme lives on <html class="dark"> and in localStorage. The inline
 * script in the root layout applies it before first paint.
 */
export function ThemeToggle() {
  const toggle = () => {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between dark and light theme"
      className="grid size-9 place-items-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
    >
      <svg viewBox="0 0 20 20" className="size-[18px]" aria-hidden="true">
        <circle
          cx="10"
          cy="10"
          r="7.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M10 2.75a7.25 7.25 0 0 1 0 14.5Z" fill="currentColor" />
      </svg>
    </button>
  );
}
