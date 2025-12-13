import PlayerState from "./PlayerState.js";
import { PlayerConfig } from "../../../config/PlayerConfig.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import Player from "./Player.js";

/**
 * Represents the jumping state of the player.
 * Player moves upward with initial jump velocity, then transitions to falling.
 * @extends PlayerState
 */
export default class PlayerJumpingState extends PlayerState {
    /**
     * Creates a new PlayerJumpingState instance.
     * @param {Player} player - The player object.
     */
    constructor(player) {
        super(player);
    }

    /**
     * Called when entering the jumping state.
     */
    enter() {
        this.player.velocity.y = PlayerConfig.jumpPower;
    }

    /**
     * Called when exiting the jumping state.
     */
    exit() {}

    /**
     * Updates the jumping state.
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {
        super.update(dt);
        this.maintainRunSpeed();
        this.checkTransitions();
    }

    /**
     * Maintains constant forward running speed.
     * Player always moves right at a constant speed.
     */
    maintainRunSpeed() {
        this.player.velocity.x = PlayerConfig.runSpeed;
    }

    /**
     * Checks for state transitions.
     * When velocity becomes positive (moving downward), switch to falling.
     */
    checkTransitions() {
        if (this.player.velocity.y >= 0) {
            this.player.stateMachine.change(PlayerStateName.Falling);
        }
    }
}
