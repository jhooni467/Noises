// Bus de eventos mínimo para desacoplar sistemas (futuro: puzzles, enemigos, diálogos, guardado...).
export class EventBus {
  constructor() { this._h = new Map(); }
  on(name, fn) { (this._h.get(name) ?? this._h.set(name, new Set()).get(name)).add(fn); return () => this.off(name, fn); }
  off(name, fn) { this._h.get(name)?.delete(fn); }
  emit(name, data) { this._h.get(name)?.forEach((fn) => fn(data)); }
}
