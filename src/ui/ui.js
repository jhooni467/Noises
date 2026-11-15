// Interfaz DOM: superposición de inicio/pausa, indicación de interacción, mensajes y FPS.
import { byId } from '../core/utils.js';

export class UI {
  constructor(isTouch) {
    this.isTouch = isTouch;
    this.overlay = byId('overlay'); this.title = byId('ov-title'); this.text = byId('ov-text');
    this.playBtn = byId('play-btn'); this.pauseBtn = byId('pause-btn');
    this.promptEl = byId('prompt'); this.messageEl = byId('message'); this.fpsEl = byId('fps');
    this._msgTimer = 0;
  }
  onPlay(cb) { this.playBtn.addEventListener('click', cb); }
  onPauseButton(cb) { this.pauseBtn.addEventListener('click', cb); }
  showOverlay(title, text, button = 'Jugar') {
    this.title.textContent = title; this.text.textContent = text; this.playBtn.textContent = button;
    this.overlay.classList.remove('hidden');
  }
  hideOverlay() { this.overlay.classList.add('hidden'); }
  setPrompt(text) {
    this.promptEl.textContent = text ? (this.isTouch ? text : `[E] ${text}`) : '';
    this.promptEl.classList.toggle('hidden', !text);
  }
  message(text, ms = 2500) {
    this.messageEl.textContent = text;
    this.messageEl.classList.remove('hidden');
    clearTimeout(this._msgTimer);
    this._msgTimer = setTimeout(() => this.messageEl.classList.add('hidden'), ms);
  }
  setFps(n) { this.fpsEl.textContent = `${n} FPS`; }
  fatal(msg) { this.showOverlay('Error', msg, 'Recargar'); this.playBtn.onclick = () => location.reload(); }
}
