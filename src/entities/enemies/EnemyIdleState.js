import EnemyState from "./EnemyState.js";

export default class EnemyIdleState extends EnemyState {
    /**
     * Idle state for stationary enemies.
     * @param {Enemy} enemy - The enemy entity
     * @param {Array} sprites - Sprite array for idle animation
     */
    constructor(enemy, sprites) {
        super(enemy, sprites);
    }

    update(dt) {
        super.update(dt);
    }
}