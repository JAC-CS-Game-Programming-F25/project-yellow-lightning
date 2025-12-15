import Input from "../../lib/Input.js";
import State from "../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";
import ImageName from "../enums/ImageName.js";
import SoundName from "../enums/SoundName.js";
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    context,
    fonts,
    images,
    input,
    sounds,
    stateMachine,
    timer,
} from "../globals.js";
import FontName from "../enums/FontName.js";

export default class TitleScreenState extends State {
    /**
     * Displays a title screen where the player
     * can press enter to start a new game.
     */
    constructor() {
        super();
    }

    enter() {
        sounds.play(SoundName.MenuMusic);
    }

    exit() {
        sounds.stop(SoundName.MenuMusic);
    }

    update(dt) {
        timer.update(dt);

        if (input.isKeyPressed(Input.KEYS.ENTER)) {
            sounds.play(SoundName.Select);
            stateMachine.change(GameStateName.Transition, {
                fromState: this,
                toStateName: GameStateName.HomeScreen,
            });
        }
    }

    render() {
        images.render(ImageName.Background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        context.font = fonts.get(FontName.Title);
        context.fillStyle = "white";
        context.textBaseline = "middle";
        context.textAlign = "center";
        context.fillText("CFS DASH", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

        context.font = fonts.get(FontName.Text);
        context.fillText(
            "press enter to begin",
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT - 40
        );
    }
}
