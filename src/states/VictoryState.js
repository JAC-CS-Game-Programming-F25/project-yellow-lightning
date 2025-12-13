import State from "../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";
import ImageName from "../enums/ImageName.js";
import Colour from "../enums/Colour.js";
import Panel from "../user-interface/elements/Panel.js";
import Selection from "../user-interface/elements/Selection.js";
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    context,
    images,
    stateMachine,
    timer,
} from "../globals.js";

export default class VictoryState extends State {
    /**
     * Victory screen with options to play again or return to menu
     */
    constructor() {
        super();
    }

    enter() {
        // Create the panel for the menu
        const panelWidth = 300;
        const panelHeight = 220;
        const panelX = (CANVAS_WIDTH - panelWidth) / 2;
        const panelY = (CANVAS_HEIGHT - panelHeight) / 2;

        this.panel = new Panel(panelX, panelY, panelWidth, panelHeight, {
            borderColour: Colour.Gold,
            panelColour: Colour.White,
        });

        // Create the selection menu with options
        const selectionX = panelX + 20;
        const selectionY = panelY + 80;
        const selectionWidth = panelWidth - 40;
        const selectionHeight = panelHeight - 100;

        this.selection = new Selection(
            selectionX,
            selectionY,
            selectionWidth,
            selectionHeight,
            [
                {
                    text: "Play Again",
                    onSelect: () => {
                        this.tryAgain();
                    },
                },
                {
                    text: "Back to Level Select",
                    onSelect: () => {
                        this.backToMenu();
                    },
                },
            ]
        );
    }

    update(dt) {
        timer.update(dt);
        this.selection.update();
    }

    render() {
        // Render background image
        images.render(ImageName.Background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Render the panel
        this.panel.render();

        // Render "VICTORY" title
        context.save();
        context.font = "40px Zelda";
        context.fillStyle = "gold";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText("VICTORY!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);
        context.restore();

        // Render the selection menu
        this.selection.render();
    }

    /**
     * Restart the current level
     */
    tryAgain() {
        stateMachine.change(GameStateName.Transition, {
            fromState: this,
            toStateName: GameStateName.Play,
        });
    }

    /**
     * Go back to the level selection menu
     */
    backToMenu() {
        stateMachine.change(GameStateName.Transition, {
            fromState: this,
            toStateName: GameStateName.HomeScreen,
        });
    }
}
