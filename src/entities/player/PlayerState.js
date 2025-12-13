import Input from "../../../lib/Input.js";
import State from "../../../lib/State.js";
import { PlayerConfig } from "../../../config/PlayerConfig.js";
import { input } from "../../globals.js";
import Tile from "../../services/Tile.js";
import CollisionDetector from "../../services/CollisionDetector.js";
import Player from "./Player.js";

/**
 * Base class for all player states.
 * @extends State
 */
export default class PlayerState extends State {
    /**
     * @param {Player} player - The player instance.
     */
    constructor(player) {
        super();
        this.player = player;
        this.collisionDetector = new CollisionDetector(player.map);
    }

    /**
     * Updates the player state.
     * @param {number} dt - Delta time.
     */
    update(dt) {
        console.log(
            "PlayerState update called, dt:",
            dt,
            "isOnGround:",
            this.player.isOnGround
        );
        this.applyGravity(dt);
        this.updatePosition(dt);
    }

    /**
     * Renders the player on the canvas.
     * This method handles the player's orientation and rendering as a rectangle.
     *
     * @param {CanvasRenderingContext2D} context - The 2D rendering context of the canvas.
     */
    render(context) {
        // Call the parent class's render method
        super.render();

        // Save the current canvas state
        context.save();

        // Render the player as a rectangle
        context.fillStyle = "red"; // Red rectangle for the player
        context.fillRect(
            Math.floor(this.player.position.x),
            Math.floor(this.player.position.y),
            this.player.dimensions.x,
            this.player.dimensions.y
        );

        // Restore the canvas state to what it was before our changes
        context.restore();
    }

    /**
     * Handles horizontal movement of the player.
     * This method updates the player's horizontal velocity based on input
     * and applies acceleration, deceleration, and speed limits.
     */
    handleHorizontalMovement() {
        const aHeld = input.isKeyHeld(Input.KEYS.A);
        const dHeld = input.isKeyHeld(Input.KEYS.D);

        if (aHeld && dHeld) {
            this.slowDown();
        } else if (aHeld) {
            this.moveLeft();
            this.player.facingRight = false;
        } else if (dHeld) {
            this.moveRight();
            this.player.facingRight = true;
        } else {
            this.slowDown();
        }

        // Set speed to zero if it's close to zero to stop the player
        if (Math.abs(this.player.velocity.x) < 0.1) this.player.velocity.x = 0;
    }

    moveRight() {
        this.player.velocity.x = Math.min(
            this.player.velocity.x + PlayerConfig.acceleration,
            PlayerConfig.maxSpeed
        );
    }

    moveLeft() {
        this.player.velocity.x = Math.max(
            this.player.velocity.x - PlayerConfig.acceleration,
            -PlayerConfig.maxSpeed
        );
    }

    slowDown() {
        if (this.player.velocity.x > 0) {
            this.player.velocity.x = Math.max(
                0,
                this.player.velocity.x - PlayerConfig.deceleration
            );
        } else if (this.player.velocity.x < 0) {
            this.player.velocity.x = Math.min(
                0,
                this.player.velocity.x + PlayerConfig.deceleration
            );
        }
    }

    /**
     * Applies gravity to the player.
     * This method increases the player's vertical velocity when they're not on the ground,
     * simulating the effect of gravity.
     *
     * @param {number} dt - Delta time (time since last update).
     */
    applyGravity(dt) {
        if (!this.player.isOnGround) {
            // Increase downward velocity, but don't exceed max fall speed
            this.player.velocity.y = Math.min(
                this.player.velocity.y + PlayerConfig.gravity * dt,
                PlayerConfig.maxFallSpeed
            );
        }
    }

    /**
     * Updates the player's position based on their current velocity.
     * This method also handles collision detection and keeps the player within the map boundaries.
     *
     * @param {number} dt - Delta time (time since last update).
     */
    updatePosition(dt) {
        // Calculate position change
        const dx = this.player.velocity.x * dt;
        const dy = this.player.velocity.y * dt;

        // Update horizontal position and check for collisions
        this.player.position.x += dx;
        this.collisionDetector.checkHorizontalCollisions(this.player);

        // Update vertical position and check for collisions
        this.player.position.y += dy;
        this.collisionDetector.checkVerticalCollisions(this.player);

        // Keep player within horizontal map boundaries
        this.player.position.x = Math.max(
            0,
            Math.min(
                Math.round(this.player.position.x),
                this.player.map.width * Tile.SIZE - this.player.dimensions.x
            )
        );

        // Round vertical position to avoid sub-pixel rendering
        this.player.position.y = Math.round(this.player.position.y);
    }
}
