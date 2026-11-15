// Controles táctiles (móviles/tablets): joystick virtual, arrastre para mirar y botón de interacción.
// Solo traduce toques a llamadas de la API de Input (setJoy, addLook, interact).
import { byId } from '../core/utils.js';

export class TouchControls {
  constructor(input) {
    document.body.classList.add('touch');
    const joy = byId('joy'), knob = byId('joy-knob'), look = byId('look-zone'), btn = byId('btn-interact');
    const R = 44, opts = { passive: false };
    let joyId = null, lookId = null, lx = 0, ly = 0;
    const find = (e, id) => [...e.changedTouches].find((t) => t.identifier === id);

    const moveJoy = (t) => {
      const r = joy.getBoundingClientRect();
      let dx = t.clientX - (r.left + r.width / 2), dy = t.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy);
      if (d > R) { dx *= R / d; dy *= R / d; }
      knob.style.transform = `translate(${dx}px,${dy}px)`;
      input.setJoy(dx / R, -dy / R);
    };
    const endJoy = () => { joyId = null; knob.style.transform = ''; input.setJoy(0, 0); };

    joy.addEventListener('touchstart', (e) => { e.preventDefault(); if (joyId === null) { const t = e.changedTouches[0]; joyId = t.identifier; moveJoy(t); } }, opts);
    joy.addEventListener('touchmove', (e) => { e.preventDefault(); const t = find(e, joyId); if (t) moveJoy(t); }, opts);
    for (const ev of ['touchend', 'touchcancel']) joy.addEventListener(ev, (e) => { if (find(e, joyId)) endJoy(); }, opts);

    look.addEventListener('touchstart', (e) => { e.preventDefault(); if (lookId === null) { const t = e.changedTouches[0]; lookId = t.identifier; lx = t.clientX; ly = t.clientY; } }, opts);
    look.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const t = find(e, lookId);
      if (!t) return;
      const s = input.cfg.camera.touchSensitivity;
      input.addLook((t.clientX - lx) * s, (t.clientY - ly) * s);
      lx = t.clientX; ly = t.clientY;
    }, opts);
    for (const ev of ['touchend', 'touchcancel']) look.addEventListener(ev, (e) => { if (find(e, lookId)) lookId = null; }, opts);

    btn.addEventListener('touchstart', (e) => { e.preventDefault(); input.interact(); }, opts);
  }
}
