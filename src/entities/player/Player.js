import Vector from "../../../lib/Vector.js";
import Map from "../../services/Map.js";
import Entity from "../Entity.js";
import StateMachine from "../../../lib/StateMachine.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import PlayerWalkingState from "./PlayerWalkingState.js";
import PlayerJumpingState from "./PlayerJumpingState.js";
import PlayerSkiddingState from "./PlayerSkiddingState.js";
import PlayerFallingState from "./PlayerFallingState.js";
import PlayerIdlingState from "./PlayerIdlingState.js";

/**
 * Represents the player character in the game.
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
        this.facingRight = true;

        // Initialize state machine for player behavior
        this.stateMachine = new StateMachine();

        // Add states to the state machine
        this.stateMachine.add(
            PlayerStateName.Walking,
            new PlayerWalkingState(this)
        );
        this.stateMachine.add(
            PlayerStateName.Jumping,
            new PlayerJumpingState(this)
        );
        this.stateMachine.add(
            PlayerStateName.Skidding,
            new PlayerSkiddingState(this)
        );
        this.stateMachine.add(
            PlayerStateName.Falling,
            new PlayerFallingState(this)
        );
        this.stateMachine.add(
            PlayerStateName.Idling,
            new PlayerIdlingState(this)
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
        this.position.set(this.initialPosition.x, this.initialPosition.y);
    }
}
