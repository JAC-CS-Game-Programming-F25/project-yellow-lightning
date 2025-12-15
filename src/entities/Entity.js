import { getCollisionDirection, isAABBCollision } from "../../lib/Collision.js";
import Hitbox from "../../lib/Hitbox.js";
import Vector from "../../lib/Vector.js";

/**
 * Represents a game entity with position, dimensions, and velocity.
 */
export default class Entity {
    /**
     * @param {number} x - Initial x position.
     * @param {number} y - Initial y position.
     * @param {number} width - Entity width.
     * @param {number} height - Entity height.
     */
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.position = new Vector(x, y);
        this.dimensions = new Vector(width, height);
        this.velocity = new Vector(0, 0);
        this.isOnGround = false;

        this.hitboxOffsets = new Hitbox(0, 0, 0, 0);

        this.hitbox = new Hitbox(
            this.position.x + this.hitboxOffsets.position.x,
            this.position.y + this.hitboxOffsets.position.y,
            this.dimensions.x + this.hitboxOffsets.dimensions.x,
            this.dimensions.y + this.hitboxOffsets.dimensions.y
        );
    }

    /**
     * Updates the entity state.
     * @param {number} dt - Delta time.
     */
    update(dt) {
        this.updateHitbox();
    }

    /**
     * Updates the hitbox position based on entity position and offsets.
     */
    updateHitbox() {
        this.hitbox.set(
            this.position.x + this.hitboxOffsets.position.x,
            this.position.y + this.hitboxOffsets.position.y,
            this.dimensions.x + this.hitboxOffsets.dimensions.x,
            this.dimensions.y + this.hitboxOffsets.dimensions.y
        );
    }

    /**
     * Renders the entity.
     * @param {CanvasRenderingContext2D} context - The rendering context.
     */
    render(context) {}

    /**
     * Checks if this entity collides with another entity.
     * @param {Entity} entity - The other entity to check collision with.
     * @returns {boolean} True if collision occurs, false otherwise.
     */
    collidesWith(entity) {
        return isAABBCollision(
            this.position.x,
            this.position.y,
            this.dimensions.x,
            this.dimensions.y,
            entity.position.x,
            entity.position.y,
            entity.dimensions.x,
            entity.dimensions.y
        );
    }

    /**
     * Gets the collision direction with another entity.
     * @param {Entity} entity - The other entity to check collision direction with.
     * @returns {number} The collision direction.
     */
    getCollisionDirection(entity) {
        return getCollisionDirection(
            this.position.x,
            this.position.y,
            this.dimensions.x,
            this.dimensions.y,
            entity.position.x,
            entity.position.y,
            entity.dimensions.x,
            entity.dimensions.y
        );
    }
}
