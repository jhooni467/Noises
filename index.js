// Registro de escenas/zonas. Para añadir un escenario: crear su archivo en esta carpeta, exportar una función
// build(ctx) que devuelva { spawn, spawnYaw } y registrarla aquí. CONFIG.startScene elige la inicial.
import { createTestRoom } from './testRoom.js';

export const SCENES = {
  testRoom: createTestRoom,
};
