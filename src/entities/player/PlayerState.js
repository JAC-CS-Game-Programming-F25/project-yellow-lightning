import State from "../../../lib/State.js";
import { PlayerConfig } from "../../../config/PlayerConfig.js";
import Tile from "../../services/Tile.js";
import CollisionDetector from "../../services/CollisionDetector.js";
import Player from "./Player.js";
import PlayerStateName from "../../enums/PlayerStateName.js";

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
        this.applyGravity(dt);
        this.updatePosition(dt);

        // Update the current animation
        this.player.currentAnimation.update(dt);
    }

    /**
     * Renders the player on the canvas.
     * This method handles the player's orientation and rendering using sprites.
     *
     * @param {CanvasRenderingContext2D} context - The 2D rendering context of the canvas.
     */
    render(context) {
        super.render();
        context.save();

        const sprite = this.player.currentAnimation.getCurrentFrame();

        sprite.render(
            Math.floor(this.player.position.x),
            Math.floor(this.player.position.y)
        );

        context.restore();
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

        // Update horizontal position
        this.player.position.x += dx;

        // Check for deadly collisions
        if (this.collisionDetector.checkDeadlyCollisions(this.player)) {
            this.player.stateMachine.change(PlayerStateName.Dying);
            return;
        }

        // Then check regular collisions
        this.collisionDetector.checkHorizontalCollisions(this.player);

        // Update vertical position
        this.player.position.y += dy;

        if (this.collisionDetector.checkDeadlyCollisions(this.player)) {
            this.player.stateMachine.change(PlayerStateName.Dying);
            return;
        }

        this.collisionDetector.checkVerticalCollisions(this.player);

        //Check for door collision
        if (this.collisionDetector.checkDoorCollision(this.player)) {
            this.player.stateMachine.change(PlayerStateName.Victory);
        }

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
