import PlayerState from "./PlayerState.js";
import { PlayerConfig } from "../../../config/PlayerConfig.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import SoundName from "../../enums/SoundName.js";
import Player from "./Player.js";
import { sounds } from "../../globals.js";

/**
 * Represents the jumping state of the player.
 * Player is in the air, moving upward with initial jump velocity.
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
     * Applies initial upward velocity for the jump.
     */
    enter() {
        sounds.play(SoundName.Jump);
        this.player.isOnGround = false;
        this.player.velocity.y = PlayerConfig.jumpPower;
        this.player.currentAnimation = this.player.animations.jump;
        this.player.currentAnimation.refresh();
    }

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
     * Maintains constant forward running speed even while jumping.
     */
    maintainRunSpeed() {
        this.player.velocity.x = PlayerConfig.runSpeed;
    }

    /**
     * Checks for state transitions.
     * If player starts falling, transition to falling state.
     * If player lands on ground, transition to running state.
     */
    checkTransitions() {
        if (this.player.velocity.y >= 0) {
            this.player.stateMachine.change(PlayerStateName.Falling);
        }

        if (this.player.isOnGround) {
            this.player.stateMachine.change(PlayerStateName.Running);
        }
    }
}
