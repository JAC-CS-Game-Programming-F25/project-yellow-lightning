import Entity from "../Entity.js";
import StateMachine from "../../../lib/StateMachine.js";
import EnemyStateName from "../../enums/EnemyStateName.js";
import EnemyIdleState from "./EnemyIdleState.js";
import EnemyMovingState from "./EnemyMovingState.js";

export default class Enemy extends Entity {
    static WIDTH = 16;
    static HEIGHT = 16;

    /**
     * Base enemy class for all enemies in the game.
     * @param {Array} sprites - Array of sprite objects for animation
     * @param {number} x - Initial x position
     * @param {number} y - Initial y position
     * @param {boolean} isMoving - Whether this enemy moves or is stationary
     */
    constructor(sprites, x, y, isMoving = false) {
        super(x, y, Enemy.WIDTH, Enemy.HEIGHT);

        this.sprites = sprites;
        this.isMoving = isMoving;
        this.isDead = false;

        // Initialize state machine with animations
        this.stateMachine = this.initializeStateMachine();
    }

    initializeStateMachine() {
        const stateMachine = new StateMachine();

        stateMachine.add(
            EnemyStateName.Idle,
            new EnemyIdleState(this, this.sprites)
        );
        stateMachine.add(
            EnemyStateName.Moving,
            new EnemyMovingState(this, this.sprites)
        );

        // Start in appropriate state based on isMoving flag
        if (this.isMoving) {
            stateMachine.change(EnemyStateName.Moving);
        } else {
            stateMachine.change(EnemyStateName.Idle);
        }

        return stateMachine;
    }

    update(dt) {
        this.stateMachine.update(dt);
        super.update(dt);
    }

    render(context) {
        this.stateMachine.render(context);
    }
}
