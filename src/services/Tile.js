import Sprite from "../../lib/Sprite.js";

/**
 * Represents a single tile in the game world.
 */
export default class Tile {
    /**
     * The size of a tile in pixels.
     * @type {number}
     */
    static SIZE = 16;

    /**
     * Creates a new Tile instance.
     * @param {number} id - The ID of the tile, corresponding to its sprite in the spritesheet.
     * @param {Sprite[]} sprites - An array of Sprite objects representing all possible tile sprites.
     */
    constructor(id, sprites) {
        this.sprites = sprites;
        this.id = id;
    }

    /**
     * Renders the tile at the specified grid coordinates.
     * @param {number} x - The x-coordinate in the tile grid (not pixels).
     * @param {number} y - The y-coordinate in the tile grid (not pixels).
     */
    render(x, y) {
        // Multiply by Tile.SIZE to convert grid coordinates to pixel coordinates
        this.sprites[this.id].render(x * Tile.SIZE, y * Tile.SIZE);
    }
}
