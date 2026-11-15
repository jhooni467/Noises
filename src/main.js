import { Game } from './core/game.js';
import { byId } from './core/utils.js';

new Game(byId('renderCanvas')).start();
