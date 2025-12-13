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

    /// Deadly tiles
    static SPIKE_1 = 183;
    static SPIKE_2 = 37;
    static SPIKE_3 = 203;
    static POST = 221;

    // Phase-through tiles
    static CHAIN_1 = 4;
    static CHAIN_2 = 5;
    static CHAIN_3 = 24;
    static CHAIN_4 = 25;
    static CHAIN_5 = 26;

    // Platform blocks
    static PLATFORM_1 = 44;
    static PLATFORM_2 = 45;
    static PLATFORM_3 = 46;
    static PLATFORM_4 = 201;

    // Floor tiles
    static FLOOR = 196;

    // Special tiles
    static DOOR = 58;

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
