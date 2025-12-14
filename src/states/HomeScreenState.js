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
    setCurrentLevel,
    getHighScore,
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
        const panelHeight = 250;
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

        // Get high scores for display
        const score1 = getHighScore(1);
        const score2 = getHighScore(2);
        const score3 = getHighScore(3);

        this.selection = new Selection(
            selectionX,
            selectionY,
            selectionWidth,
            selectionHeight,
            [
                {
                    text: `Level 1 - Best ${score1}/3`,
                    onSelect: () => {
                        this.startLevel(1);
                    },
                },
                {
                    text: `Level 2 - Best ${score2}/3`,
                    onSelect: () => {
                        this.startLevel(2);
                    },
                },
                {
                    text: `Level 3 - Best ${score3}/3`,
                    onSelect: () => {
                        this.startLevel(3);
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
     * @param {number} levelNumber - The level number to start
     */
    startLevel(levelNumber) {
        setCurrentLevel(levelNumber);
        stateMachine.change(GameStateName.Play);
    }
}
