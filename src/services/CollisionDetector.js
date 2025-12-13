import Entity from "../entities/Entity.js";
import Map from "./Map.js";

/**
 * Handles collision detection for entities in the game world.
 */
export default class CollisionDetector {
    /**
     * Creates a new CollisionDetector.
     * @param {Map} map - The game map containing collision information.
     */
    constructor(map) {
        this.map = map;
    }

    /**
     * Checks and resolves horizontal collisions for an entity.
     * @param {Entity} entity - The entity to check collisions for.
     */
    checkHorizontalCollisions(entity) {
        const tileSize = this.map.tileSize;
        const tileLeft = Math.floor(entity.position.x / tileSize);
        const tileRight = Math.floor(
            (entity.position.x + entity.dimensions.x) / tileSize
        );
        const tileTop = Math.floor(entity.position.y / tileSize);
        const tileBottom = Math.floor(
            (entity.position.y + entity.dimensions.y - 1) / tileSize
        );

        if (entity.velocity.x > 0) {
            // Moving right
            if (this.isSolidTileInColumn(tileRight, tileTop, tileBottom)) {
                // Collision on the right side
                entity.position.x = tileRight * tileSize - entity.dimensions.x;
                entity.velocity.x = 0;
            }
        } else if (entity.velocity.x < 0) {
            // Moving left
            if (this.isSolidTileInColumn(tileLeft, tileTop, tileBottom)) {
                // Collision on the left side
                entity.position.x = (tileLeft + 1) * tileSize;
                entity.velocity.x = 0;
            }
        }
    }

    /**
     * Checks and resolves vertical collisions for an entity.
     * @param {Entity} entity - The entity to check collisions for.
     */
    checkVerticalCollisions(entity) {
        const tileSize = this.map.tileSize;
        const tileLeft = Math.floor(entity.position.x / tileSize);
        const tileRight = Math.floor(
            (entity.position.x + entity.dimensions.x - 1) / tileSize
        );
        const tileTop = Math.floor(entity.position.y / tileSize);
        const tileBottom = Math.floor(
            (entity.position.y + entity.dimensions.y) / tileSize
        );

        entity.isOnGround = false;

        if (entity.velocity.y >= 0) {
            // Falling or on ground
            if (this.isSolidTileInRow(tileBottom, tileLeft, tileRight)) {
                // Collision below
                entity.position.y = tileBottom * tileSize - entity.dimensions.y;
                entity.velocity.y = 0;
                entity.isOnGround = true;
            }
        } else if (entity.velocity.y < 0) {
            // Jumping or moving upwards
            if (
                this.checkBlockCollisionFromBelow(
                    entity,
                    tileTop,
                    tileLeft,
                    tileRight
                ) ||
                this.isSolidTileInRow(tileTop, tileLeft, tileRight)
            ) {
                // Collision above
                entity.position.y = (tileTop + 1) * tileSize;
                entity.velocity.y = 0;
            }
        }
    }

    /**
     * Checks if there's a solid tile in a vertical column of tiles.
     * @param {number} x - The x-coordinate of the column to check.
     * @param {number} yStart - The starting y-coordinate of the column.
     * @param {number} yEnd - The ending y-coordinate of the column.
     * @returns {boolean} True if a solid tile is found, false otherwise.
     */
    isSolidTileInColumn(x, yStart, yEnd) {
        for (let y = yStart; y <= yEnd; y++) {
            // Ignore phase-through tiles
            if (
                this.map.isSolidTileAt(x, y) &&
                !this.map.isPhaseThrough(y, x)
            ) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if there's a solid tile in a horizontal row of tiles.
     * @param {number} y - The y-coordinate of the row to check.
     * @param {number} xStart - The starting x-coordinate of the row.
     * @param {number} xEnd - The ending x-coordinate of the row.
     * @returns {boolean} True if a solid tile is found, false otherwise.
     */
    isSolidTileInRow(y, xStart, xEnd) {
        for (let x = xStart; x <= xEnd; x++) {
            // Ignore phase-through tiles
            if (
                this.map.isSolidTileAt(x, y) &&
                !this.map.isPhaseThrough(y, x)
            ) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks for collision with a block from below.
     * @param {Entity} entity - The entity to check collisions for.
     * @param {number} tileY - The y-coordinate of the tile row to check.
     * @param {number} xStart - The starting x-coordinate of the row.
     * @param {number} xEnd - The ending x-coordinate of the row.
     * @returns {boolean} True if a collision with a block occurred, false otherwise.
     */
    checkBlockCollisionFromBelow(entity, tileY, xStart, xEnd) {
        for (let x = xStart; x <= xEnd; x++) {
            const block = this.map.getBlockAt(
                x * this.map.tileSize,
                tileY * this.map.tileSize
            );
            if (block && !block.isHit) {
                // Check if the entity's top is close to the block's bottom
                const entityTop = entity.position.y;
                const blockBottom = (tileY + 1) * this.map.tileSize;
                if (Math.abs(entityTop - blockBottom) < 5) {
                    // 5 pixels threshold
                    block.hit();
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Checks if entity is colliding with any deadly tiles.
     * This includes pure deadly tiles and platform side collisions.
     * @param {Entity} entity - The entity to check.
     * @returns {boolean} True if deadly collision occurred, false otherwise.
     */
    checkDeadlyCollisions(entity) {
        const tileSize = this.map.tileSize;
        const tileLeft = Math.floor(entity.position.x / tileSize);
        const tileRight = Math.floor(
            (entity.position.x + entity.dimensions.x) / tileSize
        );
        const tileTop = Math.floor(entity.position.y / tileSize);
        const tileBottom = Math.floor(
            (entity.position.y + entity.dimensions.y) / tileSize
        );

        // Check all tiles the player overlaps with
        for (let y = tileTop; y <= tileBottom; y++) {
            for (let x = tileLeft; x <= tileRight; x++) {
                const tile = this.map.foregroundLayer.getTile(x, y);

                if (tile) {
                    // Check for deadly tiles
                    if (this.map.isDeadlyTile(y, x)) {
                        return true;
                    }

                    // Check for platform side collisions
                    if (this.map.isPlatformTile(y, x)) {
                        if (this.isPlatformSideCollision(entity, y, tileSize)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    /**
     * Checks if entity hit a platform block from the side.
     * Platforms are safe to land on from above, but deadly from sides.
     * @param {Entity} entity - The entity to check.
     * @param {number} tileX - Platform tile X coordinate.
     * @param {number} tileY - Platform tile Y coordinate.
     * @param {number} tileSize - Size of tiles.
     * @returns {boolean} True if side collision occurred, false otherwise.
     */
    isPlatformSideCollision(entity, tileY, tileSize) {
        const platformTop = tileY * tileSize;
        const platformBottom = (tileY + 1) * tileSize;

        const entityTop = entity.position.y;
        const entityBottom = entity.position.y + entity.dimensions.y;

        // If player is moving horizontally into the platform
        if (entity.velocity.x !== 0) {
            // Check if entity's vertical position overlaps with platform sides
            const verticalOverlap =
                entityBottom > platformTop + 2 &&
                entityTop < platformBottom - 2;

            if (verticalOverlap) {
                return true;
            }
        }

        return false;
    }

    /**
     * Checks if entity is colliding with a door tile (win condition).
     * @param {Entity} entity - The entity to check.
     * @returns {boolean} True if door collision occurred, false otherwise.
     */
    checkDoorCollision(entity) {
        const tileSize = this.map.tileSize;
        const tileLeft = Math.floor(entity.position.x / tileSize);
        const tileRight = Math.floor(
            (entity.position.x + entity.dimensions.x) / tileSize
        );
        const tileTop = Math.floor(entity.position.y / tileSize);
        const tileBottom = Math.floor(
            (entity.position.y + entity.dimensions.y) / tileSize
        );

        // Check all tiles the player overlaps with
        for (let y = tileTop; y <= tileBottom; y++) {
            for (let x = tileLeft; x <= tileRight; x++) {
                if (this.map.isDoorTile(y, x)) {
                    return true;
                }
            }
        }
        return false;
    }
}
