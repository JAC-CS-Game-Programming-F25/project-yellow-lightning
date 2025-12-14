import EnemyType from "../enums/EnemyType.js";
import Skull from "../entities/enemies/Skull.js";

/**
 * Factory for creating enemy instances.
 */
export default class Factory {
    /**
     * Creates an enemy instance based on type.
     * @param {string} type - Enemy type from EnemyType enum
     * @param {Array} sprites - Sprite array for the enemy
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {boolean} isMoving - Whether the enemy moves
     * @returns {Enemy} The created enemy instance
     */
    static createEnemy(type, sprites, x, y, isMoving = false) {
        switch (type) {
            case EnemyType.Skull:
                return new Skull(sprites, x, y, isMoving);
            default:
                return null;
        }
    }
}
