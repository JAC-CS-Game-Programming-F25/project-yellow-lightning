import PlayerState from "./PlayerState.js";
import Player from "./Player.js";
import GameStateName from "../../enums/GameStateName.js";
import { stateMachine } from "../../globals.js";

/**
 * Represents the dying state of the player.
 * Player has died and plays death animation.
 * @extends PlayerState
 */
export default class PlayerDyingState extends PlayerState {
    /**
     * Creates a new PlayerDyingState instance.
     * @param {Player} player - The player object.
     */
    constructor(player) {
        super(player);
        this.animationComplete = false;
    }

    /**
     * Called when entering the dying state.
     */
    enter() {
        this.player.velocity.x = 0;
        this.player.velocity.y = 0;
        this.animationComplete = false;
        // Set the death animation
        this.player.currentAnimation = this.player.animations.death;
        this.player.currentAnimation.refresh();
    }

    /**
     * Updates the dying state.
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {
        // Only update animation, no movement or physics
        this.player.currentAnimation.update(dt);

        // After animation finishes, transition to game over screen
        if (this.player.currentAnimation.isDone() && !this.animationComplete) {
            this.animationComplete = true;
            this.player.hasDied = true;
            stateMachine.change(GameStateName.GameOver);
        }
    }
}
