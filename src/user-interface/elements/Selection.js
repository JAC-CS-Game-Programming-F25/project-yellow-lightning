import UserInterfaceElement from "../UserInterfaceElement.js";
import { context, input, sounds } from "../../globals.js";
import SoundName from "../../enums/SoundName.js";
import Vector from "../../../lib/Vector.js";
import Input from "../../../lib/Input.js";

export default class Selection extends UserInterfaceElement {
    /**
     * A UI element that gives us a list of textual items.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {array} items
     */
    constructor(x, y, width, height, items) {
        super(x, y, width, height);

        this.gapHeight = this.dimensions.y / (items.length + 1);
        this.items = this.initializeItems(items);
        this.currentSelection = 0;
        this.font = this.initializeFont();
    }

    update() {
        if (
            input.isKeyPressed(Input.KEYS.W) ||
            input.isKeyPressed(Input.KEYS.ARROW_UP)
        ) {
            this.navigateUp();
        } else if (
            input.isKeyPressed(Input.KEYS.S) ||
            input.isKeyPressed(Input.KEYS.ARROW_DOWN)
        ) {
            this.navigateDown();
        } else if (
            input.isKeyPressed(Input.KEYS.ENTER) ||
            input.isKeyPressed(Input.KEYS.SPACE)
        ) {
            this.select();
        }
    }

    render() {
        this.items.forEach((item, index) => {
            this.renderSelectionItem(item, index);
        });
    }

    renderSelectionItem(item, index) {
        if (index === this.currentSelection) {
            this.renderSelectionArrow(item);
        }

        context.save();
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = this.font;
        context.fillStyle = "black";
        context.fillText(item.text, item.position.x, item.position.y);
        context.restore();
    }

    renderSelectionArrow(item) {
        context.save();
        context.fillStyle = "black";
        context.translate(this.position.x + 20, item.position.y - 5);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(6, 5);
        context.lineTo(0, 10);
        context.closePath();
        context.fill();
        context.restore();
    }

    navigateUp() {
        sounds.play(SoundName.Navigate);

        if (this.currentSelection === 0) {
            this.currentSelection = this.items.length - 1;
        } else {
            this.currentSelection--;
        }
    }

    navigateDown() {
        sounds.play(SoundName.Navigate);

        if (this.currentSelection === this.items.length - 1) {
            this.currentSelection = 0;
        } else {
            this.currentSelection++;
        }
    }

    select() {
        sounds.play(SoundName.Select);
        this.items[this.currentSelection].onSelect();
    }

    /**
     * Adds a position property to each item to be used for rendering.
     *
     * @param {array} items
     * @returns The items array where each item now has a position property.
     */
    initializeItems(items) {
        let currentY = this.position.y;

        items.forEach((item) => {
            const padding = currentY + this.gapHeight;

            item.position = new Vector(
                this.position.x + this.dimensions.x / 2,
                padding
            );

            currentY += this.gapHeight;
        });

        return items;
    }

    /**
     * Scales the font size based on the size of this Selection element.
     */
    initializeFont() {
        return `${Math.min(UserInterfaceElement.FONT_SIZE, this.gapHeight)}px ${
            UserInterfaceElement.FONT_FAMILY
        }`;
    }
}
