// Orquestador: crea los sistemas, carga la escena inicial y gestiona el bucle principal y la pausa.
// Los sistemas (objetos con update(dt)) se registran con addSystem(); así los futuros (zonas, diálogos,
// puzzles, guardado...) se añaden sin tocar el bucle.
import { CONFIG } from './config.js';
import { EventBus } from './events.js';
import { createEngine } from './engine.js';
import { lockLandscape } from './utils.js';
import { Input } from '../controls/input.js';
import { Physics } from '../physics/physics.js';
import { FirstPersonCamera } from '../player/firstPersonCamera.js';
import { Player } from '../player/player.js';
import { InteractionSystem } from '../interaction/interactions.js';
import { AudioManager } from '../audio/audio.js';
import { UI } from '../ui/ui.js';
import { SCENES } from '../scenes/index.js';

export class Game {
  constructor(canvas) { this.canvas = canvas; this.paused = true; this.systems = []; this._fpsT = 0; }

  addSystem(system) { this.systems.push(system); return system; }

  async start() {
    const bus = (this.bus = new EventBus());
    const input = (this.input = new Input(this.canvas, bus, CONFIG));
    const ui = (this.ui = new UI(input.isTouch));
    try {
      if (!window.BABYLON) throw new Error('No se pudo cargar Babylon.js (revisa la conexión).');
      const audio = (this.audio = new AudioManager(CONFIG.audio));
      const engine = (this.engine = await createEngine(this.canvas, CONFIG.render));
      const scene = (this.scene = new BABYLON.Scene(engine));

      const physics = this.addSystem(new Physics(scene, CONFIG));
      const view = new FirstPersonCamera(scene, CONFIG);
      const player = (this.player = this.addSystem(new Player(view, input, physics, CONFIG)));
      const interactions = (this.interactions = this.addSystem(new InteractionSystem(scene, view.camera, bus, CONFIG.interaction)));

      const build = SCENES[CONFIG.startScene];
      if (!build) throw new Error(`Escena desconocida: ${CONFIG.startScene}`);
      const world = build({ scene, bus, input, ui, audio, physics, interactions, player, game: this });
      player.teleport(world.spawn, world.spawnYaw);

      bus.on('interact:target', (t) => ui.setPrompt(t ? t.prompt : null));
      bus.on('input:interact', () => { if (!this.paused) interactions.interact(); });
      bus.on('pointer:unlocked', () => { if (!this.paused && !input.isTouch) this.pause(); });
      ui.onPlay(() => this.resume());
      ui.onPauseButton(() => this.pause());
      window.addEventListener('blur', () => { if (!this.paused) this.pause(); });
      window.addEventListener('resize', () => engine.resize());
      window.addEventListener('orientationchange', () => setTimeout(() => engine.resize(), 250));

      engine.runRenderLoop(() => {
        const dt = Math.min(engine.getDeltaTime() / 1000, 0.05);
        if (!this.paused) for (const s of this.systems) s.update(dt);
        scene.render();
        this._fpsT += dt;
        if (CONFIG.debug.showFps && this._fpsT > 0.5) { this._fpsT = 0; ui.setFps(Math.round(engine.getFps())); }
      });
      ui.showOverlay('NOISES', 'Base técnica · Etapa 1 (escenario de pruebas)');
    } catch (err) {
      console.error(err);
      ui.fatal(err.message || String(err));
    }
  }

  resume() {
    this.audio.unlock();
    this.paused = false;
    this.input.setEnabled(true);
    this.ui.hideOverlay();
    if (!this.input.isTouch) this.input.lockPointer();
    else lockLandscape();
  }

  pause() {
    this.paused = true;
    this.input.setEnabled(false);
    this.input.unlockPointer();
    this.ui.setPrompt(null);
    this.interactions.target = null;
    this.ui.showOverlay('Pausa', 'El juego está en pausa', 'Continuar');
  }
}
