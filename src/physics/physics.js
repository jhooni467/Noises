// Colisiones y físicas: activa colisiones en la escena, define el cuerpo del jugador (elipsoide + gravedad)
// y ofrece solid() para marcar mallas como sólidas. Es un "sistema": game.js llama a update(dt) cada frame.
export class Physics {
  constructor(scene, cfg) {
    this.scene = scene; this.cfg = cfg.player;
    scene.collisionsEnabled = true;
    scene.gravity = new BABYLON.Vector3(0, 0, 0);
  }

  // Cuerpo del jugador sobre la cámara: Babylon resuelve colisiones y suelo con el elipsoide.
  attachBody(camera) {
    const B = BABYLON, p = this.cfg;
    camera.checkCollisions = true; camera.applyGravity = true;
    camera.ellipsoid = new B.Vector3(p.radius, p.bodyHeight / 2, p.radius);
    camera.ellipsoidOffset = new B.Vector3(0, -(p.eyeHeight - p.bodyHeight / 2), 0);
  }

  solid(mesh, material) {
    if (material) mesh.material = material;
    mesh.checkCollisions = true;
    return mesh;
  }

  // Babylon aplica la gravedad por frame (no por segundo): se escala con dt para ser independiente de los FPS.
  update(dt) { this.scene.gravity.y = -this.cfg.fallSpeed * dt; }
}
