import Graphic from "./Graphic.js";

export default class Sprite {
    /**
     * Represents a Graphic from a sprite sheet that will be drawn on the canvas.
     *
     * @param {Graphic} graphic
     * @param {number} x The X coordinate of the Sprite in the Sprite sheet.
     * @param {number} y The X coordinate of the Sprite in the Sprite sheet.
     * @param {number} width
     * @param {number} height
     */
    constructor(graphic, x = 0, y = 0, width, height) {
        this.graphic = graphic;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * Draws the Sprite onto the canvas.
     *
     * @param {number} canvasX The X coordinate of where the Sprite will be drawn on the canvas.
     * @param {number} canvasY The Y coordinate of where the Sprite will be drawn on the canvas.
     * @param {object} scale Can be used to draw the Sprite bigger or smaller.
     */
    render(canvasX, canvasY, scale = { x: 1, y: 1 }) {
        this.graphic.context.drawImage(
            this.graphic.image,
            this.x,
            this.y,
            this.width,
            this.height,
            Math.floor(canvasX),
            Math.floor(canvasY),
            this.width * scale.x,
            this.height * scale.y
        );
    }

    /**
     * This function assumes that every individual sprite in the specified
     * sprite sheet is the exact same width and height. The sprites also must
     * be laid out in a grid where the grid dimensions are tileWidth x tileHeight.
     *
     * Initial implementation didn't account for the 1px spacing between tiles
     * in the spritesheet, causing sprites to become increasingly misaligned as
     * the tile index increased. Fixed by calculating sprite positions as
     * index * (tileWidth + spacing) instead of index * tileWidth.
     *
     * @param {Graphic} spriteSheet
     * @param {number} tileWidth
     * @param {number} tileHeight
     * @returns {Sprite[]} An array of Sprite objects
     */
    static generateSpritesFromSpriteSheet(spriteSheet, tileWidth, tileHeight) {
        const sprites = [];
        const spacing = 1; // Spacing between tiles

        const sheetWidth = Math.floor(
            (spriteSheet.width + spacing) / (tileWidth + spacing)
        );
        const sheetHeight = Math.floor(
            (spriteSheet.height + spacing) / (tileHeight + spacing)
        );

        for (let y = 0; y < sheetHeight; y++) {
            for (let x = 0; x < sheetWidth; x++) {
                sprites.push(
                    new Sprite(
                        spriteSheet,
                        x * (tileWidth + spacing),
                        y * (tileHeight + spacing),
                        tileWidth,
                        tileHeight
                    )
                );
            }
        }

        return sprites;
    }
}
