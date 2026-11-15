# NOISES

Videojuego 3D de terror, exploración y puzzles en primera persona, con temática de circo.
**Estado: Etapa 2 — organización y arquitectura.** El escenario actual es solo de pruebas; el circo, la historia y las mecánicas definitivas aún no existen.

## Tecnología
HTML + CSS + JavaScript (módulos ES) y [Babylon.js](https://www.babylonjs.com/) 7.x (WebGL; WebGPU opcional con `?webgpu=1`). Sin bundler ni compilación.

## Cómo ejecutarlo
- **GitHub Pages** (recomendado): *Settings → Pages → Deploy from a branch → main / (root)*. Abre `https://TU_USUARIO.github.io/Noises/`.
- **Local**: los módulos ES no funcionan abriendo `index.html` con doble clic; usa un servidor, por ejemplo `python3 -m http.server 8080`.

Requiere conexión: Babylon.js se carga desde jsDelivr (versión fijada en `index.html`).

## Controles
| PC | Móvil / tablet (horizontal) |
|---|---|
| WASD / flechas: mover · Shift: correr | Joystick izquierdo: mover |
| Ratón: mirar | Arrastrar a la derecha: mirar |
| E (o clic): interactuar | Botón «Usar» |
| ESC: pausa | Botón de pausa (II) |

## Estructura
```
index.html                      Página y HTML de interfaz
css/style.css                   Estilos
src/main.js                     Punto de entrada
src/core/config.js              Configuración central
src/core/events.js              Bus de eventos
src/core/engine.js              Inicialización del motor (WebGL / WebGPU)
src/core/game.js                Orquestador: sistemas, escena inicial, bucle y pausa
src/core/utils.js               Utilidades compartidas
src/physics/physics.js          Colisiones, gravedad y mallas sólidas
src/player/firstPersonCamera.js Cámara en primera persona
src/player/player.js            Movimiento del jugador
src/controls/input.js           Entrada unificada (teclado/ratón) y API común
src/controls/touchControls.js   Joystick y controles táctiles
src/interaction/interactions.js Detección e interacción con objetos
src/scenes/index.js             Registro de escenas
src/scenes/testRoom.js          Escenario provisional de pruebas
src/audio/audio.js              Buses de volumen y sonidos provisionales
src/ui/ui.js                    Pausa, indicaciones y mensajes
```

## Cómo se extiende
- **Nuevo sistema** (zonas, diálogos, puzzles, guardado…): una clase con `update(dt)` en su propia carpeta, registrada en `Game.start()` con `game.addSystem(...)`. Se comunica con el resto mediante el bus de eventos.
- **Nueva escena o zona**: un archivo en `src/scenes/` con una función `build(ctx)` que devuelve `{ spawn, spawnYaw }`, registrada en `src/scenes/index.js`. `CONFIG.startScene` elige la inicial.
- **Nuevo objeto interactuable**: `interactions.register(mesh, { id, prompt, onInteract })`.
- **Nuevo dispositivo de entrada** (por ejemplo, mando): usa `input.setJoy`, `input.addLook` e `input.interact`.
- **Eventos actuales**: `input:interact`, `interact:target`, `interact:done`, `pointer:locked`, `pointer:unlocked`.

## Pendiente (no implementado)
Diálogos, eventos narrativos, detección de zonas, secuencias ambientales, audio espacial 3D, puzzles, inventario, guardado, cambio de escena en caliente y todo el contenido definitivo.
