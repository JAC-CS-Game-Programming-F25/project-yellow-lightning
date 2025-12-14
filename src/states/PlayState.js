import State from "../../lib/State.js";
import Map from "../services/Map.js";
import Player from "../entities/player/Player.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import GameStateName from "../enums/GameStateName.js";
import ImageName from "../enums/ImageName.js";
import Camera from "../services/Camera.js";
import {
    images,
    context,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    stateMachine,
} from "../globals.js";

/**
 * Represents the main play state of the game.
 * @extends State
 */
export default class PlayState extends State {
    /**
     * Creates a new PlayState instance.
     * @param {Object} mapDefinition - The definition object for the game map.
     */
    constructor(mapDefinition) {
        super();

        this.map = new Map(mapDefinition, images.get(ImageName.Tiles));

        // Create player at starting position
        this.player = new Player(2 * 16, 15 * 16, 16, 16, this.map);

        // Start player in falling state
        this.player.stateMachine.change(PlayerStateName.Falling);

        // Create camera to follow the player
        this.camera = new Camera(
            this.player,
            CANVAS_WIDTH,
            CANVAS_HEIGHT,
            this.map.width * 16,
            this.map.height * 16
        );
    }

    /**
     * Called when entering the play state.
     * Resets the player's position and flags for a fresh start.
     */
    enter() {
        // Reset the map to restore all coins and tiles
        this.map.reset();

        // Reset player position to start
        this.player.position.set(
            this.player.initialPosition.x,
            this.player.initialPosition.y
        );

        // Reset win/lose flags
        this.player.hasWon = false;
        this.player.hasDied = false;

        // Reset coin counter
        this.player.coinsCollected = 0;

        // Reset player to falling state
        this.player.stateMachine.change(PlayerStateName.Falling);
    }

    /**
     * Updates the play state.
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {
        this.map.update(dt);
        this.player.update(dt);
        this.camera.update(dt);

        // Check for victory condition
        if (this.player.hasWon) {
            stateMachine.change(GameStateName.Transition, {
                fromState: this,
                toStateName: GameStateName.Victory,
            });
        }

        // Check for game over condition
        if (this.player.hasDied) {
            stateMachine.change(GameStateName.Transition, {
                fromState: this,
                toStateName: GameStateName.GameOver,
            });
        }
    }

    /**
     * Renders the play state.
     * @param {CanvasRenderingContext2D} context - The rendering context.
     */
    render() {
        // Clear the canvas with sky blue background
        context.fillStyle = "#5C94FC";
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Apply camera transform
        this.camera.applyTransform(context);

        // Render game world
        this.map.render(context);
        this.player.render(context);

        // Reset camera transform
        this.camera.resetTransform(context);
    }
}
