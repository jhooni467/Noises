// Sistema de interacción: lanza un rayo desde el centro de la cámara y detecta el primer objeto interactuable.
// Un "interactuable" es un objeto { id, prompt, onInteract(ctx), enabled? } asociado a una malla.
// Las paredes bloquean el rayo, así que no se puede interactuar a través de ellas.
export class InteractionSystem {
  constructor(scene, camera, bus, cfg) {
    this.scene = scene; this.camera = camera; this.bus = bus; this.cfg = cfg;
    this.target = null; this._acc = 0;
  }

  register(mesh, def) {
    mesh.isPickable = true;
    mesh.metadata = { ...(mesh.metadata || {}), interactable: def };
    return def;
  }

  update(dt) {
    this._acc += dt;
    if (this._acc < this.cfg.checkInterval) return;
    this._acc = 0;
    const ray = this.camera.getForwardRay(this.cfg.range);
    const hit = this.scene.pickWithRay(ray, (m) => m.isPickable && m.isEnabled());
    const def = hit?.hit ? hit.pickedMesh.metadata?.interactable : null;
    const next = def && def.enabled !== false ? def : null;
    if (next !== this.target) {
      this.target = next;
      this.bus.emit('interact:target', next);
    }
  }

  interact() {
    const t = this.target;
    if (!t) return;
    t.onInteract?.({ bus: this.bus });
    this.bus.emit('interact:done', t);
  }
}
