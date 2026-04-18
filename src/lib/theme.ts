export type AppTheme = "dark" | "light";

export const THEME_STORAGE_KEY = "simple-yt-theme";
export const DEFAULT_THEME: AppTheme = "dark";

/**
 * Inline script injected into <head> via dangerouslySetInnerHTML before any CSS or JS loads.
 *
 * WHY THIS EXISTS — THE FLASH PROBLEM
 * SSR sends HTML with no knowledge of the user's theme preference. Without this script,
 * the browser paints the page using whatever the stylesheet's default is (dark), then React
 * hydrates and reads localStorage, then updates the DOM. That two-step produces a visible
 * flash — the wrong theme for a frame or two before the correct one snaps in.
 *
 * HOW IT FIXES IT
 * A render-blocking <script> in <head> runs synchronously before the browser paints anything.
 * It reads localStorage and sets data-theme + the "dark" class on <html> immediately, so by
 * the time the first CSS rule is evaluated the correct theme selector is already in place.
 * The user sees the right theme on the very first paint — no flash.
 *
 * WHY IT'S MINIFIED
 * This string is embedded as a raw <script> tag, not bundled. Keeping it on one line avoids
 * any newline/whitespace edge cases when interpolated into the HTML stream. The try/catch
 * ensures localStorage failures (private browsing, storage quota, iframe sandboxing) silently
 * fall back to the dark default rather than throwing and blocking the render.
 */
export const themeInitScript = `(function(){try{var key='${THEME_STORAGE_KEY}';var stored=window.localStorage.getItem(key);var theme=stored==='light'?'light':'dark';document.documentElement.dataset.theme=theme;document.documentElement.classList.toggle('dark',theme==='dark');}catch(_error){document.documentElement.dataset.theme='dark';document.documentElement.classList.add('dark');}})();`;

export function getCurrentTheme(): AppTheme {
  if (typeof document === "undefined") {
    return DEFAULT_THEME;
  }

  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function setTheme(theme: AppTheme) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage write failures in privacy-restricted contexts.
  }
}
