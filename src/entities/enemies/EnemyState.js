import State from "../../../lib/State.js";
import Animation from "../../../lib/Animation.js";

export default class EnemyState extends State {
    /**
     * Base class for enemy states.
     * @param {Enemy} enemy - The enemy entity
     * @param {Array} sprites - Sprite array for this state
     */
    constructor(enemy, sprites) {
        super();

        this.enemy = enemy;
        this.animation = new Animation(sprites, 0.2);
    }

    update(dt) {
        this.animation.update(dt);
    }

    render() {
        const sprite = this.animation.getCurrentFrame();
        sprite.render(
            Math.floor(this.enemy.position.x),
            Math.floor(this.enemy.position.y)
        );
    }
}
