// Inicialización del motor gráfico: WebGL por defecto, WebGPU si está activado (config o ?webgpu=1) y es compatible.
export async function createEngine(canvas, cfg) {
  const B = BABYLON;
  const wantGPU = cfg.useWebGPU || new URLSearchParams(location.search).has('webgpu');
  let engine;
  if (wantGPU && B.WebGPUEngine && (await B.WebGPUEngine.IsSupportedAsync)) {
    engine = new B.WebGPUEngine(canvas, { antialias: cfg.antialias });
    await engine.initAsync();
  } else {
    engine = new B.Engine(canvas, cfg.antialias, { stencil: false }, true);
  }
  engine.setHardwareScalingLevel(1 / Math.min(window.devicePixelRatio || 1, cfg.maxPixelRatio));
  return engine;
}
