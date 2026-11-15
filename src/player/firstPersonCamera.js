// Cámara en primera persona: creación, campo de visión, rotación (con límite vertical) y colocación.
// No gestiona entrada ni movimiento; eso lo hacen src/controls y src/player/player.js.
import { clamp } from '../core/utils.js';

export class FirstPersonCamera {
  constructor(scene, cfg) {
    const B = BABYLON;
    this.eyeHeight = cfg.player.eyeHeight;
    this.pitchLimit = cfg.camera.pitchLimit;
    const cam = (this.camera = new B.UniversalCamera('playerCam', new B.Vector3(0, this.eyeHeight, 0), scene));
    cam.inputs.clear();   // la entrada la gestiona src/controls/input.js
    cam.inertia = 0;      // sin deslizamiento: el desplazamiento se calcula cada frame
    cam.minZ = 0.05; cam.maxZ = 100;
    this.setFov(cfg.camera.fovDeg);
    scene.activeCamera = cam;
  }

  setFov(deg) { this.camera.fov = BABYLON.Tools.ToRadians(deg); }

  // dx: giro horizontal, dy: giro vertical (radianes)
  look(dx, dy) {
    const r = this.camera.rotation;
    r.y += dx;
    r.x = clamp(r.x + dy, -this.pitchLimit, this.pitchLimit);
  }

  teleport(pos, yaw = 0) {
    this.camera.position.set(pos.x, pos.y + this.eyeHeight + 0.05, pos.z);
    this.camera.rotation.set(0, yaw, 0);
  }
}
