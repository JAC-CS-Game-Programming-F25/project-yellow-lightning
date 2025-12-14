import Enemy from "./Enemy.js";

export default class Skull extends Enemy {
    /**
     * Flying skull enemy that can be stationary or moving.
     * @param {Array} sprites - Array of sprite objects for animation
     * @param {number} x - Initial x position
     * @param {number} y - Initial y position
     * @param {boolean} isMoving - Whether this skull moves or is stationary
     */
    constructor(sprites, x, y, isMoving = false) {
        super(sprites, x, y, isMoving);
    }
}
