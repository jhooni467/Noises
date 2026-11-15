// Movimiento del jugador: lee la entrada, gira la cámara y desplaza el cuerpo.
// El desplazamiento se aplica vía cameraDirection para que el motor resuelva colisiones y suelo.
export class Player {
  constructor(view, input, physics, cfg) {
    this.view = view; this.input = input; this.cfg = cfg.player;
    physics.attachBody(view.camera);
  }

  teleport(pos, yaw) { this.view.teleport(pos, yaw); }

  update(dt) {
    const look = this.input.consumeLook();
    this.view.look(look.x, look.y);

    const cam = this.view.camera, p = this.cfg;
    const m = this.input.getMove();
    const speed = (this.input.running ? p.runSpeed : p.walkSpeed) * dt;
    const s = Math.sin(cam.rotation.y), c = Math.cos(cam.rotation.y);
    cam.cameraDirection.x += (s * m.y + c * m.x) * speed;
    cam.cameraDirection.z += (c * m.y - s * m.x) * speed;
  }
}
