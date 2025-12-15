import PlayerState from "./PlayerState.js";
import Player from "./Player.js";
import GameStateName from "../../enums/GameStateName.js";
import SoundName from "../../enums/SoundName.js";
import { stateMachine, sounds } from "../../globals.js";

/**
 * Represents the victory state of the player.
 * Player has won and plays victory animation.
 * @extends PlayerState
 */
export default class PlayerVictoryState extends PlayerState {
    /**
     * Creates a new PlayerVictoryState instance.
     * @param {Player} player - The player object.
     */
    constructor(player) {
        super(player);
        this.animationComplete = false;
    }

    /**
     * Called when entering the victory state.
     */
    enter() {
        sounds.play(SoundName.Victory);
        this.player.velocity.x = 0;
        this.player.velocity.y = 0;
        this.animationComplete = false;
        // Set the victory animation
        this.player.currentAnimation = this.player.animations.victory;
        this.player.currentAnimation.refresh();
    }

    /**
     * Updates the victory state.
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {
        // Only update animation, no movement or physics
        this.player.currentAnimation.update(dt);

        // After animation finishes, transition to victory screen
        if (this.player.currentAnimation.isDone() && !this.animationComplete) {
            this.animationComplete = true;
            this.player.hasWon = true;
            stateMachine.change(GameStateName.Victory);
        }
    }
}
