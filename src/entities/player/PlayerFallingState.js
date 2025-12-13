import PlayerState from "./PlayerState.js";
import { PlayerConfig } from "../../../config/PlayerConfig.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import Player from "./Player.js";

/**
 * Represents the falling state of the player.
 * Player moves downward due to gravity until landing on ground.
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
    enter() {}

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
     * Maintains constant forward running speed.
     * Player always moves right at a constant speed.
     */
    maintainRunSpeed() {
        this.player.velocity.x = PlayerConfig.runSpeed;
    }

    /**
     * Checks for state transitions.
     * When player lands on ground, switch to running.
     */
    checkTransitions() {
        if (this.player.isOnGround) {
            this.player.stateMachine.change(PlayerStateName.Running);
        }
    }
}
