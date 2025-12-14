import PlayerState from "./PlayerState.js";
import { input } from "../../globals.js";
import { PlayerConfig } from "../../../config/PlayerConfig.js";
import Input from "../../../lib/Input.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import Player from "./Player.js";

/**
 * Represents the running state of the player.
 * Player constantly moves forward on the ground and can jump with W key.
 * @extends PlayerState
 */
export default class PlayerRunningState extends PlayerState {
    /**
     * Creates a new PlayerRunningState instance.
     * @param {Player} player - The player object.
     */
    constructor(player) {
        super(player);
    }

    /**
     * Called when entering the running state.
     */
    enter() {
        this.player.isOnGround = true;
        this.player.velocity.y = 0;
        // Set the running animation
        this.player.currentAnimation = this.player.animations.run;
        this.player.currentAnimation.refresh();
    }

    /**
     * Updates the running state.
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {
        super.update(dt);
        this.handleInput();
        this.maintainRunSpeed();
        this.checkTransitions();
    }

    /**
     * Handles player input.
     * W key makes the player jump.
     */
    handleInput() {
        if (input.isKeyPressed(Input.KEYS.W)) {
            this.player.stateMachine.change(PlayerStateName.Jumping);
        }
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
     * If player walks off edge, start falling.
     */
    checkTransitions() {
        if (!this.player.isOnGround) {
            this.player.stateMachine.change(PlayerStateName.Falling);
        }
    }
}
