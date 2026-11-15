// Audio: buses de volumen independientes (master / music / sfx / ambient) sobre Web Audio.
// Pendiente (etapas futuras): carga de archivos desde assets/audio y audio espacial 3D.
export class AudioManager {
  constructor(volumes) { this.volumes = { ...volumes }; this.ctx = null; this.buses = {}; }

  // Debe llamarse dentro de un gesto del usuario (clic/toque), por política de los navegadores.
  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.connect(this.ctx.destination);
      for (const n of ['music', 'sfx', 'ambient']) {
        const g = this.ctx.createGain();
        g.connect(this.master);
        this.buses[n] = g;
      }
      this._apply();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  setVolume(name, v) { this.volumes[name] = v; this._apply(); }

  _apply() {
    if (!this.ctx) return;
    this.master.gain.value = this.volumes.master;
    for (const n in this.buses) this.buses[n].gain.value = this.volumes[n];
  }

  // Sonido provisional generado por código (sin archivos).
  blip(freq = 440, dur = 0.12, bus = 'sfx') {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'square';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(this.buses[bus]);
    o.start(t);
    o.stop(t + dur);
  }
}
