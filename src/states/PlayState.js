import State from "../../lib/State.js";
import Map from "../services/Map.js";
import Player from "../entities/player/Player.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import { images, context, CANVAS_WIDTH, CANVAS_HEIGHT } from "../globals.js";

/**
 * Represents the main play state of the game.
 * @extends State
 */
export default class PlayState extends State {
    /**
     * Creates a new PlayState instance.
     * @param {Object} mapDefinition - The definition object for the game map.
     */
    constructor(mapDefinition) {
        super();

        this.map = new Map(mapDefinition, images.get("tiles"));

        // Create player at starting position
        this.player = new Player(2 * 16, 15 * 16, 16, 16, this.map);

        console.log(
            "Player created at:",
            this.player.position.x,
            this.player.position.y
        );

        // Start player in falling state
        this.player.stateMachine.change(PlayerStateName.Falling);
    }

    /**
     * Updates the play state.
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {
        this.map.update(dt);
        this.player.update(dt);
    }

    /**
     * Renders the play state.
     * @param {CanvasRenderingContext2D} context - The rendering context.
     */
    render() {
        // Clear the canvas with sky blue background
        context.fillStyle = "#5C94FC";
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        this.map.render(context);
        this.player.render(context);
    }
}
