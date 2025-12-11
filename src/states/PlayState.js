import State from "../../lib/State.js";
import Map from "../services/Map.js";
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
    }

    /**
     * Updates the play state.
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {
        this.map.update(dt);
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
    }
}
