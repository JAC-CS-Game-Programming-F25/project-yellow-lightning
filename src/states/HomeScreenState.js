import State from "../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";
import ImageName from "../enums/ImageName.js";
import Colour from "../enums/Colour.js";
import Panel from "../user-interface/elements/Panel.js";
import Selection from "../user-interface/elements/Selection.js";
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    images,
    stateMachine,
    timer,
} from "../globals.js";

export default class HomeScreenState extends State {
    /**
     * Home/Menu screen with level selection
     */
    constructor() {
        super();
    }

    enter() {
        // Create the panel for the menu
        const panelWidth = 250;
        const panelHeight = 200;
        const panelX = (CANVAS_WIDTH - panelWidth) / 2;
        const panelY = (CANVAS_HEIGHT - panelHeight) / 2;

        this.panel = new Panel(panelX, panelY, panelWidth, panelHeight, {
            borderColour: Colour.Black,
            panelColour: Colour.White,
        });

        // Create the selection menu with level options
        const selectionX = panelX + 20;
        const selectionY = panelY + 20;
        const selectionWidth = panelWidth - 40;
        const selectionHeight = panelHeight - 40;

        this.selection = new Selection(
            selectionX,
            selectionY,
            selectionWidth,
            selectionHeight,
            [
                {
                    text: "Level 1",
                    onSelect: () => {
                        this.startLevel();
                    },
                },
                {
                    text: "Level 2",
                    onSelect: () => {
                        this.startLevel();
                    },
                },
                {
                    text: "Level 3",
                    onSelect: () => {
                        this.startLevel();
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

        // Render the selection menu
        this.selection.render();
    }

    /**
     * Start the selected level with a transition
     */
    startLevel() {
        stateMachine.change(GameStateName.Transition, {
            fromState: this,
            toStateName: GameStateName.Play,
        });
    }
}
