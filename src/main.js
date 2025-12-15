/**
 * CFS DASH
 *
 * Cody Petrone
 *
 * Runner like game with extensive objects.
 * Goal is ot run to the end without dying
 * to reach the door to escape!
 *
 * Assets:
 * https://fonts.google.com/specimen/Press+Start+2P?query=Press+Start+2P
 * https://fonts.google.com/specimen/VT323?query=VT323
 * https://freesound.org/people/suntemple/sounds/253178/
 * https://freesound.org/people/likeclockwork/sounds/168408/
 * https://freesound.org/people/Xiko__/sounds/711129/
 * https://freesound.org/people/1bob/sounds/717771/
 * https://freesound.org/people/gobbe57/sounds/794487/
 * https://freesound.org/people/pumodi/sounds/150222/
 * https://freesound.org/people/szegvari/sounds/591010/\
 * https://free-game-assets.itch.io/free-war-pixel-art-game-backgrounds
 * https://www.kenney.nl/assets/1-bit-platformer-pack
 */

import GameStateName from "./enums/GameStateName.js";
import Game from "../lib/Game.js";
import {
    canvas,
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    context,
    fonts,
    images,
    timer,
    sounds,
    stateMachine,
    setLevelDefinitions,
} from "./globals.js";
import PlayState from "./states/PlayState.js";
import GameOverState from "./states/GameOverState.js";
import VictoryState from "./states/VictoryState.js";
import TitleScreenState from "./states/TitleScreenState.js";
import TransitionState from "./states/TransitionState.js";
import HomeScreenState from "./states/HomeScreenState.js";

// Set the dimensions of the play area.
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.setAttribute("tabindex", "1"); // Allows the canvas to receive user input.

// Now that the canvas element has been prepared, we can add it to the DOM.
document.body.appendChild(canvas);

// Fetch the asset definitions from config.json.
const {
    images: imageDefinitions,
    fonts: fontDefinitions,
    sounds: soundDefinitions,
} = await fetch("./src/config.json").then((response) => response.json());

// Load all the assets from their definitions.
images.load(imageDefinitions);
fonts.load(fontDefinitions);
sounds.load(soundDefinitions);

// Load all level definitions
const levelDefinitions = {
    1: await fetch("./config/levelone.json").then((response) =>
        response.json()
    ),
    2: await fetch("./config/leveltwo.json").then((response) =>
        response.json()
    ),
};

// Store level definitions globally for access by other states
setLevelDefinitions(levelDefinitions);

// Add all the states to the state machine.
stateMachine.add(GameStateName.Transition, new TransitionState());
stateMachine.add(GameStateName.TitleScreen, new TitleScreenState());
stateMachine.add(GameStateName.HomeScreen, new HomeScreenState());
stateMachine.add(GameStateName.GameOver, new GameOverState());
stateMachine.add(GameStateName.Victory, new VictoryState());
stateMachine.add(GameStateName.Play, new PlayState(levelDefinitions[1]));
stateMachine.change(GameStateName.TitleScreen);

const game = new Game(
    stateMachine,
    context,
    timer,
    canvas.width,
    canvas.height
);

game.start();

// Focus the canvas so that the player doesn't have to click on it.
canvas.focus();
