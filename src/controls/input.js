// Entrada unificada: teclado + ratón (pointer lock) y, en táctil, delega en touchControls.js.
// El resto del juego solo consulta getMove() / consumeLook() y escucha eventos del bus.
import { isCoarsePointer } from '../core/utils.js';
import { TouchControls } from './touchControls.js';

const KEYS = { KeyW: 'f', ArrowUp: 'f', KeyS: 'b', ArrowDown: 'b', KeyA: 'l', ArrowLeft: 'l', KeyD: 'r', ArrowRight: 'r' };

export class Input {
  constructor(canvas, bus, cfg) {
    this.canvas = canvas; this.bus = bus; this.cfg = cfg;
    this.isTouch = isCoarsePointer();
    this.enabled = false; this.running = false;
    this.keys = new Set(); this.joy = { x: 0, y: 0 }; this.lookX = 0; this.lookY = 0;
    this._initKeyboard(); this._initMouse();
    if (this.isTouch) new TouchControls(this);
  }

  setEnabled(on) {
    this.enabled = on;
    if (!on) { this.keys.clear(); this.running = false; this.joy.x = this.joy.y = 0; this.lookX = this.lookY = 0; }
  }

  lockPointer() { try { Promise.resolve(this.canvas.requestPointerLock?.()).catch(() => {}); } catch { /* ignorado */ } }
  unlockPointer() { if (document.pointerLockElement) document.exitPointerLock(); }

  // --- API para dispositivos de entrada (ratón, táctil, futuros mandos) ---
  addLook(dx, dy) { if (this.enabled) { this.lookX += dx; this.lookY += dy; } }
  setJoy(x, y) { this.joy.x = this.enabled ? x : 0; this.joy.y = this.enabled ? y : 0; }
  interact() { if (this.enabled) this.bus.emit('input:interact'); }

  // --- API para el resto del juego ---
  getMove() {
    let x = this.joy.x, y = this.joy.y;
    if (this.keys.has('r')) x += 1;
    if (this.keys.has('l')) x -= 1;
    if (this.keys.has('f')) y += 1;
    if (this.keys.has('b')) y -= 1;
    const len = Math.hypot(x, y);
    if (len > 1) { x /= len; y /= len; }
    return { x, y };
  }

  // Devuelve el giro acumulado en radianes desde la última llamada.
  consumeLook() {
    const r = { x: this.lookX, y: this.lookY * (this.cfg.camera.invertY ? -1 : 1) };
    this.lookX = this.lookY = 0;
    return r;
  }

  _initKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (!this.enabled) return;
      if (KEYS[e.code]) { this.keys.add(KEYS[e.code]); e.preventDefault(); }
      else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.running = true;
      else if (e.code === 'KeyE' && !e.repeat) this.interact();
    });
    window.addEventListener('keyup', (e) => {
      if (KEYS[e.code]) this.keys.delete(KEYS[e.code]);
      else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.running = false;
    });
  }

  _initMouse() {
    document.addEventListener('pointerlockchange', () =>
      this.bus.emit(document.pointerLockElement === this.canvas ? 'pointer:locked' : 'pointer:unlocked'));
    document.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement !== this.canvas) return;
      const s = this.cfg.camera.mouseSensitivity;
      this.addLook(e.movementX * s, e.movementY * s);
    });
    this.canvas.addEventListener('mousedown', () => {
      if (document.pointerLockElement === this.canvas) this.interact();
    });
  }
}
