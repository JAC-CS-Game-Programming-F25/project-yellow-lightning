import Panel from "./Panel.js";
import Colour from "../../enums/Colour.js";
import { context, CANVAS_WIDTH } from "../../globals.js";

/**
 * A panel that displays the current score (coins collected) during gameplay.
 */
export default class ScorePanel extends Panel {
    /**
     * Creates a new ScorePanel.
     * @param {number} coinsCollected - Current coins collected.
     * @param {number} totalCoins - Total coins in the level.
     */
    constructor(coinsCollected, totalCoins) {
        // Position at top center of screen
        const panelWidth = 120;
        const panelHeight = 40;
        const panelX = (CANVAS_WIDTH - panelWidth) / 2;
        const panelY = 10;

        super(panelX, panelY, panelWidth, panelHeight, {
            borderColour: Colour.Black,
            panelColour: Colour.White,
        });

        this.coinsCollected = coinsCollected;
        this.totalCoins = totalCoins;
        this.fontSize = 16;
    }

    /**
     * Updates the coin count.
     * @param {number} coinsCollected - Updated coins collected.
     */
    updateScore(coinsCollected) {
        this.coinsCollected = coinsCollected;
    }

    /**
     * Renders the score panel.
     */
    render() {
        if (!this.isVisible) {
            return;
        }

        // Render the panel background
        super.render();

        // Render the coin count text
        context.save();
        context.fillStyle = Colour.Black;
        context.font = `${this.fontSize}px Arial, sans-serif`;
        context.textAlign = "center";
        context.textBaseline = "middle";

        const text = `${this.coinsCollected}/${this.totalCoins}`;
        const textX = this.position.x + this.dimensions.x / 2;
        const textY = this.position.y + this.dimensions.y / 2;

        context.fillText(text, textX, textY);
        context.restore();
    }
}
