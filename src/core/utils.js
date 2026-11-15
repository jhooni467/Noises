// Utilidades generales compartidas por varios módulos.
export const byId = (id) => document.getElementById(id);
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export const isCoarsePointer = () => window.matchMedia('(pointer: coarse)').matches;

// En móviles/tablets intenta pantalla completa + horizontal (no todos los navegadores lo permiten; en iOS se ignora).
export function lockLandscape() {
  Promise.resolve(document.documentElement.requestFullscreen?.())
    .then(() => screen.orientation?.lock?.('landscape'))
    .catch(() => {});
}
