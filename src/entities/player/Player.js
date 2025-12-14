import Vector from "../../../lib/Vector.js";
import Map from "../../services/Map.js";
import Entity from "../Entity.js";
import StateMachine from "../../../lib/StateMachine.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import PlayerRunningState from "./PlayerRunningState.js";
import PlayerJumpingState from "./PlayerJumpingState.js";
import PlayerFallingState from "./PlayerFallingState.js";
import { images } from "../../globals.js";
import ImageName from "../../enums/ImageName.js";
import {
    loadPlayerSprites,
    playerSpriteConfig,
} from "../../../config/SpriteConfig.js";
import Animation from "../../../lib/Animation.js";
import PlayerDyingState from "./PlayerDyingState.js";
import PlayerVictoryState from "./PlayerVictoryState.js";

/**
 * Represents the player character in the game.
 * Player constantly runs forward and can jump with W key.
 * @extends Entity
 */
export default class Player extends Entity {
    /**
     * Creates a new Player instance.
     * @param {number} x - The initial x-coordinate.
     * @param {number} y - The initial y-coordinate.
     * @param {number} width - The width of the player.
     * @param {number} height - The height of the player.
     * @param {Map} map - The game map instance.
     */
    constructor(x, y, width, height, map) {
        super(x, y, width, height);

        this.initialPosition = new Vector(x, y);
        this.position = new Vector(x, y);
        this.dimensions = new Vector(width, height);
        this.velocity = new Vector(0, 0);
        this.map = map;
        this.hasWon = false;
        this.hasDied = false;
        this.coinsCollected = 0;
        this.playState = null;

        // Load player sprites
        this.sprites = loadPlayerSprites(
            images.get(ImageName.Tiles),
            playerSpriteConfig
        );

        // Create animations for different player states
        // Create animations for different player states
        this.animations = {
            idle: new Animation(this.sprites.idle, 0.1),
            run: new Animation(this.sprites.run, 0.1),
            jump: new Animation(this.sprites.jump, 0.1),
            fall: new Animation(this.sprites.fall, 0.1),
            death: new Animation(this.sprites.death, 0.3, 1),
            victory: new Animation(this.sprites.victory, 0.3, 1),
        };

        this.currentAnimation = this.animations.idle;

        // Initialize state machine for player behavior
        this.stateMachine = new StateMachine();

        // Add states to the state machine
        this.stateMachine.add(
            PlayerStateName.Running,
            new PlayerRunningState(this)
        );
        this.stateMachine.add(
            PlayerStateName.Jumping,
            new PlayerJumpingState(this)
        );
        this.stateMachine.add(
            PlayerStateName.Falling,
            new PlayerFallingState(this)
        );
        this.stateMachine.add(
            PlayerStateName.Dying,
            new PlayerDyingState(this)
        );
        this.stateMachine.add(
            PlayerStateName.Victory,
            new PlayerVictoryState(this)
        );
    }

    /**
     * Updates the player's state.
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {
        this.stateMachine.update(dt);
    }

    /**
     * Renders the player.
     * @param {CanvasRenderingContext2D} context - The rendering context.
     */
    render(context) {
        this.stateMachine.render(context);
    }

    /**
     * Handles player death by resetting position.
     */
    die() {
        this.hasDied = true;
        this.position.set(this.initialPosition.x, this.initialPosition.y);
    }
}
