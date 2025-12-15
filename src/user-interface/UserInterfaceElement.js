import Vector from "../../lib/Vector.js";

export default class UserInterfaceElement {
    static FONT_SIZE = 16;
    static FONT_FAMILY = "text";

    /**
     * The base UI element that all interface elements should extend.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    constructor(x, y, width, height) {
        this.position = new Vector(x, y);
        this.dimensions = new Vector(width, height);
    }
}
