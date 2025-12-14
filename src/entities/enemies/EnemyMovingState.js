import EnemyState from "./EnemyState.js";

export default class EnemyMovingState extends EnemyState {
    /**
     * Moving state for enemies that float up and down.
     * @param {Enemy} enemy - The enemy entity
     * @param {Array} sprites - Sprite array for moving animation
     */
    constructor(enemy, sprites) {
        super(enemy, sprites);

        this.speed = 30;
        this.maxOffset = 18;
        this.direction = 1;
        this.startY = enemy.position.y;
    }

    update(dt) {
        super.update(dt);

        this.enemy.position.y += this.direction * this.speed * dt;

        if (this.enemy.position.y > this.startY + this.maxOffset) {
            this.direction = -1;
        }

        if (this.enemy.position.y < this.startY - this.maxOffset) {
            this.direction = 1;
        }
    }
}
