import State from "../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";
import ImageName from "../enums/ImageName.js";
import Colour from "../enums/Colour.js";
import Panel from "../user-interface/elements/Panel.js";
import Selection from "../user-interface/elements/Selection.js";
import {
    currentLevel,
    sounds,
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    context,
    fonts,
    images,
    stateMachine,
    timer,
} from "../globals.js";
import SaveManager from "../services/SaveManager.js";
import SoundName from "../enums/SoundName.js";
import FontName from "../enums/FontName.js";

export default class GameOverState extends State {
    /**
     * Game Over screen with options to retry or return to menu
     */
    constructor() {
        super();
    }

    enter() {
        if (currentLevel === 1) {
            sounds.play(SoundName.Lev1Cinematic);
        } else if (currentLevel === 2) {
            sounds.play(SoundName.Lev2Cinematic);
        }

        SaveManager.clearGameProgress();

        // Create the panel for the menu
        const panelWidth = 300;
        const panelHeight = 220;
        const panelX = (CANVAS_WIDTH - panelWidth) / 2;
        const panelY = (CANVAS_HEIGHT - panelHeight) / 2;

        this.panel = new Panel(panelX, panelY, panelWidth, panelHeight, {
            borderColour: Colour.Crimson,
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
                    text: "Try Again",
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

    exit() {
        if (currentLevel === 1) {
            sounds.stop(SoundName.Lev1Cinematic);
        } else if (currentLevel === 2) {
            sounds.stop(SoundName.Lev2Cinematic);
        }
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

        // Render "GAME OVER" title
        context.save();
        context.font = fonts.get(FontName.TitleSmall);
        context.fillStyle = "crimson";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);
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
