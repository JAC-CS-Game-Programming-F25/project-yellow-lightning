import PlayerState from "./PlayerState.js";
import { PlayerConfig } from "../../../config/PlayerConfig.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import Player from "./Player.js";

/**
 * Represents the falling state of the player.
 * @extends PlayerState
 */
export default class PlayerFallingState extends PlayerState {
    /**
     * Creates a new PlayerFallingState instance.
     * @param {Player} player - The player object.
     */
    constructor(player) {
        super(player);
    }

    /**
     * Called when entering the falling state.
     */
    enter() {
        this.player.isOnGround = false;
        // Set the fall animation
        this.player.currentAnimation = this.player.animations.fall;
        this.player.currentAnimation.refresh();
    }

    /**
     * Updates the falling state.
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {
        super.update(dt);
        this.maintainRunSpeed();
        this.checkTransitions();
    }

    /**
     * Maintains constant forward running speed even while falling.
     */
    maintainRunSpeed() {
        this.player.velocity.x = PlayerConfig.runSpeed;
    }

    /**
     * Checks for state transitions.
     * If player lands on ground, transition to running state.
     */
    checkTransitions() {
        if (this.player.isOnGround) {
            this.player.stateMachine.change(PlayerStateName.Running);
        }
    }
}
