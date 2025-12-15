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
        const hitbox = entity.hitbox;

        const tileLeft = Math.floor(hitbox.position.x / tileSize);
        const tileRight = Math.floor(
            (hitbox.position.x + hitbox.dimensions.x) / tileSize
        );
        const tileTop = Math.floor(hitbox.position.y / tileSize);
        const tileBottom = Math.floor(
            (hitbox.position.y + hitbox.dimensions.y - 1) / tileSize
        );

        if (entity.velocity.x > 0) {
            // Moving right
            if (this.isSolidTileInColumn(tileRight, tileTop, tileBottom)) {
                entity.position.x =
                    tileRight * tileSize -
                    hitbox.dimensions.x -
                    entity.hitboxOffsets.position.x;
                entity.velocity.x = 0;
            }
        } else if (entity.velocity.x < 0) {
            // Moving left
            if (this.isSolidTileInColumn(tileLeft, tileTop, tileBottom)) {
                // Collision on the left side
                entity.position.x =
                    (tileLeft + 1) * tileSize - entity.hitboxOffsets.position.x;
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
        const hitbox = entity.hitbox;

        const tileLeft = Math.floor(hitbox.position.x / tileSize);
        const tileRight = Math.floor(
            (hitbox.position.x + hitbox.dimensions.x - 1) / tileSize
        );
        const tileTop = Math.floor(hitbox.position.y / tileSize);
        const tileBottom = Math.floor(
            (hitbox.position.y + hitbox.dimensions.y) / tileSize
        );

        entity.isOnGround = false;

        if (entity.velocity.y >= 0) {
            // Falling or on ground
            if (this.isSolidTileInRow(tileBottom, tileLeft, tileRight)) {
                // Collision below
                entity.position.y =
                    tileBottom * tileSize -
                    hitbox.dimensions.y -
                    entity.hitboxOffsets.position.y;
                entity.velocity.y = 0;
                entity.isOnGround = true;
            } else {
                // Check platform tiles with actual hitbox collision
                for (let x = tileLeft; x <= tileRight; x++) {
                    if (this.map.isPlatformTile(tileBottom, x)) {
                        const platformTile = this.map.foregroundLayer.getTile(
                            x,
                            tileBottom
                        );

                        if (platformTile) {
                            const platformHitboxTop =
                                tileBottom * tileSize +
                                platformTile.hitboxOffsetY;
                            const platformHitboxBottom =
                                platformHitboxTop + platformTile.hitboxHeight;
                            const platformHitboxLeft =
                                x * tileSize + platformTile.hitboxOffsetX;
                            const platformHitboxRight =
                                platformHitboxLeft + platformTile.hitboxWidth;

                            const hitboxBottom =
                                hitbox.position.y + hitbox.dimensions.y;
                            const hitboxLeft = hitbox.position.x;
                            const hitboxRight =
                                hitbox.position.x + hitbox.dimensions.x;

                            if (
                                hitboxBottom >= platformHitboxTop &&
                                hitboxBottom <= platformHitboxBottom &&
                                hitboxRight > platformHitboxLeft &&
                                hitboxLeft < platformHitboxRight
                            ) {
                                entity.position.y =
                                    platformHitboxTop -
                                    hitbox.dimensions.y -
                                    entity.hitboxOffsets.position.y;
                                entity.velocity.y = 0;
                                entity.isOnGround = true;
                                break;
                            }
                        }
                    }
                }
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
                entity.position.y =
                    (tileTop + 1) * tileSize - entity.hitboxOffsets.position.y;
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
                if (this.map.isPlatformTile(y, x)) {
                    continue;
                }
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
        const hitbox = entity.hitbox;

        for (let x = xStart; x <= xEnd; x++) {
            const block = this.map.getBlockAt(
                x * this.map.tileSize,
                tileY * this.map.tileSize
            );
            if (block && !block.isHit) {
                const hitboxTop = hitbox.position.y;
                const blockBottom = (tileY + 1) * this.map.tileSize;
                if (Math.abs(hitboxTop - blockBottom) < 5) {
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
        const hitbox = entity.hitbox;

        const tileLeft = Math.floor(hitbox.position.x / tileSize);
        const tileRight = Math.floor(
            (hitbox.position.x + hitbox.dimensions.x) / tileSize
        );
        const tileTop = Math.floor(hitbox.position.y / tileSize);
        const tileBottom = Math.floor(
            (hitbox.position.y + hitbox.dimensions.y) / tileSize
        );

        for (let y = tileTop; y <= tileBottom; y++) {
            for (let x = tileLeft; x <= tileRight; x++) {
                const tile = this.map.foregroundLayer.getTile(x, y);

                if (tile) {
                    if (this.map.isDeadlyTile(y, x)) {
                        const tileHitbox = {
                            x: x * tileSize + tile.hitboxOffsetX,
                            y: y * tileSize + tile.hitboxOffsetY,
                            width: tile.hitboxWidth,
                            height: tile.hitboxHeight,
                        };

                        const overlaps = !(
                            hitbox.position.x + hitbox.dimensions.x <
                                tileHitbox.x ||
                            hitbox.position.x >=
                                tileHitbox.x + tileHitbox.width ||
                            hitbox.position.y + hitbox.dimensions.y <
                                tileHitbox.y ||
                            hitbox.position.y >=
                                tileHitbox.y + tileHitbox.height
                        );

                        if (overlaps) {
                            return true;
                        }
                    }

                    if (this.map.isPlatformTile(y, x)) {
                        if (
                            this.isPlatformSideCollision(entity, y, x, tileSize)
                        ) {
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
     * @param {number} tileY - Platform tile Y coordinate.
     * @param {number} tileX - Platform tile X coordinate.
     * @param {number} tileSize - Size of tiles.
     * @returns {boolean} True if side collision occurred, false otherwise.
     */
    isPlatformSideCollision(entity, tileY, tileX, tileSize) {
        const hitbox = entity.hitbox;
        const platformTile = this.map.foregroundLayer.getTile(tileX, tileY);

        if (platformTile && entity.velocity.x !== 0) {
            const platformHitboxTop =
                tileY * tileSize + platformTile.hitboxOffsetY;
            const platformHitboxBottom =
                platformHitboxTop + platformTile.hitboxHeight;

            const hitboxTop = hitbox.position.y;
            const hitboxBottom = hitbox.position.y + hitbox.dimensions.y;

            const verticalOverlap =
                hitboxBottom > platformHitboxTop + 2 &&
                hitboxTop < platformHitboxBottom - 2;

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
        const hitbox = entity.hitbox;

        const tileLeft = Math.floor(hitbox.position.x / tileSize);
        const tileRight = Math.floor(
            (hitbox.position.x + hitbox.dimensions.x) / tileSize
        );
        const tileTop = Math.floor(hitbox.position.y / tileSize);
        const tileBottom = Math.floor(
            (hitbox.position.y + hitbox.dimensions.y) / tileSize
        );

        // Check all tiles the player's hitbox overlaps with
        for (let y = tileTop; y <= tileBottom; y++) {
            for (let x = tileLeft; x <= tileRight; x++) {
                if (this.map.isDoorTile(y, x)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Checks if entity is colliding with coin tiles and returns their positions.
     * @param {Entity} entity - The entity to check.
     * @returns {Array} Array of {x, y} with coin positions collected
     */
    checkCoinCollisions(entity) {
        const tileSize = this.map.tileSize;
        const hitbox = entity.hitbox;

        const tileLeft = Math.floor(hitbox.position.x / tileSize);
        const tileRight = Math.floor(
            (hitbox.position.x + hitbox.dimensions.x) / tileSize
        );
        const tileTop = Math.floor(hitbox.position.y / tileSize);
        const tileBottom = Math.floor(
            (hitbox.position.y + hitbox.dimensions.y) / tileSize
        );

        const collectedCoins = [];

        // Check all tiles the player's hitbox overlaps with
        for (let y = tileTop; y <= tileBottom; y++) {
            for (let x = tileLeft; x <= tileRight; x++) {
                if (this.map.isCoinTile(y, x)) {
                    const tile = this.map.foregroundLayer.getTile(x, y);

                    if (tile) {
                        // Get coin's hitbox position
                        const coinHitbox = {
                            x: x * tileSize + tile.hitboxOffsetX,
                            y: y * tileSize + tile.hitboxOffsetY,
                            width: tile.hitboxWidth,
                            height: tile.hitboxHeight,
                        };

                        // Check if entity hitbox overlaps with coin hitbox
                        const overlaps = !(
                            hitbox.position.x + hitbox.dimensions.x <=
                                coinHitbox.x ||
                            hitbox.position.x >=
                                coinHitbox.x + coinHitbox.width ||
                            hitbox.position.y + hitbox.dimensions.y <=
                                coinHitbox.y ||
                            hitbox.position.y >=
                                coinHitbox.y + coinHitbox.height
                        );

                        if (overlaps) {
                            this.map.removeTile(x, y);
                            collectedCoins.push({ x: x, y: y });
                        }
                    }
                }
            }
        }

        return collectedCoins;
    }

    /**
     * Checks if entity is colliding with booster tiles and returns true if boost should be applied.
     * @param {Entity} entity - The entity to check.
     * @returns {boolean} True if entity is touching a booster, false otherwise.
     */
    checkBoosterCollisions(entity) {
        const tileSize = this.map.tileSize;
        const hitbox = entity.hitbox;

        const tileLeft = Math.floor(hitbox.position.x / tileSize);
        const tileRight = Math.floor(
            (hitbox.position.x + hitbox.dimensions.x) / tileSize
        );
        const tileTop = Math.floor(hitbox.position.y / tileSize);
        const tileBottom = Math.floor(
            (hitbox.position.y + hitbox.dimensions.y) / tileSize
        );

        // Check all tiles the player's hitbox overlaps with
        for (let y = tileTop; y <= tileBottom; y++) {
            for (let x = tileLeft; x <= tileRight; x++) {
                if (this.map.isBoosterTile(y, x)) {
                    return true;
                }
            }
        }

        return false;
    }
}
