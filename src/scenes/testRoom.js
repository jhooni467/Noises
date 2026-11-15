// ESCENARIO PROVISIONAL DE PRUEBAS. No es el circo definitivo: solo geometría simple para validar
// movimiento, cámara, colisiones, iluminación e interacción.
// ctx = { scene, bus, input, ui, audio, physics, interactions, player, game }
export function createTestRoom({ scene, physics, interactions, audio, ui }) {
  const B = BABYLON;
  const solid = (mesh, material) => physics.solid(mesh, material);
  const bg = new B.Color3(0.05, 0.035, 0.07);
  scene.clearColor = new B.Color4(bg.r, bg.g, bg.b, 1);
  scene.fogMode = B.Scene.FOGMODE_EXP2; scene.fogDensity = 0.03; scene.fogColor = bg;

  const mat = (name, hex, emissive) => {
    const m = new B.StandardMaterial(name, scene);
    m.diffuseColor = B.Color3.FromHexString(hex);
    m.specularColor = B.Color3.Black();
    if (emissive) m.emissiveColor = B.Color3.FromHexString(emissive);
    return m;
  };

  // Luces: ambiente tenue + lámpara cálida central (controlada por el interruptor)
  const ambient = new B.HemisphericLight('ambient', new B.Vector3(0, 1, 0), scene);
  ambient.intensity = 0.3; ambient.groundColor = new B.Color3(0.1, 0.06, 0.12);
  const lamp = new B.PointLight('lamp', new B.Vector3(0, 2.7, 0), scene);
  lamp.diffuse = new B.Color3(1, 0.78, 0.5); lamp.intensity = 0.9; lamp.range = 16;
  const bulb = B.MeshBuilder.CreateSphere('bulb', { diameter: 0.3, segments: 8 }, scene);
  bulb.material = mat('bulbMat', '#ffd9a0', '#ffd9a0'); bulb.isPickable = false;
  bulb.position.set(0, 2.7, 0);

  // Suelo con damero (para percibir el movimiento), paredes y techo
  const tex = new B.DynamicTexture('checker', { width: 128, height: 128 }, scene, false);
  const ctx = tex.getContext();
  ctx.fillStyle = '#3b2a44'; ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = '#7a2f3a'; ctx.fillRect(0, 0, 64, 64); ctx.fillRect(64, 64, 64, 64);
  tex.update(); tex.uScale = tex.vScale = 8;
  const floorMat = mat('floorMat', '#ffffff'); floorMat.diffuseTexture = tex;
  solid(B.MeshBuilder.CreateGround('floor', { width: 16, height: 16 }, scene), floorMat);

  const wallMat = mat('wallMat', '#5a4a6a');
  const wall = (name, w, h, d, x, y, z) => {
    const m = solid(B.MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene), wallMat);
    m.position.set(x, y, z);
  };
  wall('wallN', 16.8, 3.4, 0.4, 0, 1.7, 8.2); wall('wallS', 16.8, 3.4, 0.4, 0, 1.7, -8.2);
  wall('wallE', 0.4, 3.4, 16, 8.2, 1.7, 0);   wall('wallW', 0.4, 3.4, 16, -8.2, 1.7, 0);
  wall('ceiling', 16.8, 0.2, 16.8, 0, 3.5, 0);

  // Obstáculos para probar colisiones
  const colors = ['#c8423a', '#e0b030', '#2a9d8f'];
  [[-3, 3], [3.5, 4], [-4.5, -3]].forEach(([x, z], i) => {
    const b = solid(B.MeshBuilder.CreateBox('crate' + i, { size: 1.2 }, scene), mat('crateMat' + i, colors[i]));
    b.position.set(x, 0.6, z); b.rotation.y = i * 0.6;
  });
  const pillar = solid(B.MeshBuilder.CreateCylinder('pillar', { diameter: 0.9, height: 3.4, tessellation: 16 }, scene), mat('pillarMat', '#8a7a9a'));
  pillar.position.set(4.5, 1.7, -4);

  // Objeto interactuable: interruptor que enciende/apaga la lámpara
  const base = solid(B.MeshBuilder.CreateBox('switchBase', { width: 0.5, height: 1.0, depth: 0.5 }, scene), mat('switchBaseMat', '#4a3a58'));
  base.position.set(2.5, 0.5, -1.5);
  const knob = solid(B.MeshBuilder.CreateBox('switchKnob', { size: 0.3 }, scene), mat('switchKnobMat', '#222222', '#30d060'));
  knob.position.set(2.5, 1.15, -1.5);
  let on = true;
  const sw = {
    id: 'test-switch',
    prompt: 'Accionar interruptor',
    onInteract() {
      on = !on;
      lamp.intensity = on ? 0.9 : 0;
      bulb.material.emissiveColor = on ? B.Color3.FromHexString('#ffd9a0') : B.Color3.Black();
      knob.material.emissiveColor = B.Color3.FromHexString(on ? '#30d060' : '#d03030');
      ui.message(on ? 'Luz encendida' : 'Luz apagada');
      audio.blip(on ? 660 : 330);
    },
  };
  interactions.register(base, sw);
  interactions.register(knob, sw);

  return { spawn: new B.Vector3(-5.5, 0, 5.5), spawnYaw: Math.atan2(1, -1) };
}
