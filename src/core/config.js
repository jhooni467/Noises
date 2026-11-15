// Configuración centralizada de NOISES. Los valores se leen desde aquí; ningún sistema define números "mágicos" propios.
export const CONFIG = {
  startScene: 'testRoom', // id de escena registrada en src/scenes/index.js
  render: { useWebGPU: false, maxPixelRatio: 2, antialias: true }, // WebGPU también con ?webgpu=1
  player: { walkSpeed: 2.6, runSpeed: 4.4, eyeHeight: 1.7, bodyHeight: 1.8, radius: 0.35, fallSpeed: 7 },
  camera: { fovDeg: 75, mouseSensitivity: 0.0022, touchSensitivity: 0.005, pitchLimit: 1.45, invertY: false },
  interaction: { range: 2.6, checkInterval: 0.06 },
  audio: { master: 0.8, music: 0.6, sfx: 0.9, ambient: 0.7 },
  debug: { showFps: true },
};
