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
    static POST_6 = 185;
    static POST_1 = 221;
    static POST_2 = 220;
    static POST_3 = 202;
    static POST_4 = 203;
    static POST_5 = 222;

    // Phase-through tiles
    static CHAIN_1 = 4;
    static CHAIN_2 = 5;
    static CHAIN_3 = 24;
    static CHAIN_4 = 25;
    static CHAIN_5 = 26;
    static NATURE_1 = 35;
    static NATURE_2 = 33;
    static NATURE_3 = 38;
    static NATURE_4 = 17;
    static NATURE_5 = 16;
    static NATURE_5 = 18;

    // Platform blocks
    static PLATFORM_1 = 44;
    static PLATFORM_2 = 45;
    static PLATFORM_3 = 46;
    static PLATFORM_4 = 201;
    static PLATFORM_8 = 216;
    static PLATFORM_5 = 180;
    static PLATFORM_6 = 181;
    static PLATFORM_7 = 182;

    // Floor tiles
    static FLOOR_1 = 196;
    static FLOOR_2 = 276;
    static FLOOR_3 = 336;

    // Special tiles
    static DOOR = 58;

    // Collectables
    static COIN = 21;

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
