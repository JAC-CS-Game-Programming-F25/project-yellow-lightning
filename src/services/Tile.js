import Sprite from "../../lib/Sprite.js";
import Hitbox from "../../lib/Hitbox.js";

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
    static POKER = 6;

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
    static NATURE_6 = 18;

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
    static FLOOR_4 = 104;
    static FLOOR_5 = 105;
    static FLOOR_6 = 106;

    // Special tiles
    static DOOR = 58;
    static BOOSTER = 163;

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

        this.hitboxOffsetX = 0;
        this.hitboxOffsetY = 0;
        this.hitboxWidth = Tile.SIZE;
        this.hitboxHeight = Tile.SIZE;

        if (this.isSpike()) {
            this.hitboxOffsetX = 0;
            this.hitboxOffsetY = 0;
            this.hitboxWidth = 14;
            this.hitboxHeight = 10;

            if (this.id === Tile.SPIKE_2) {
                this.hitboxOffsetY = 0;
                this.hitboxHeight = 12;
            }
        } else if (this.isPlatform()) {
            this.hitboxOffsetY = 0;
            this.hitboxHeight = 8;
        } else if (this.isCoin()) {
            this.hitboxOffsetX = 4;
            this.hitboxOffsetY = 4;
            this.hitboxWidth = 8;
            this.hitboxHeight = 8;
        }

        this.hitbox = new Hitbox(0, 0, this.hitboxWidth, this.hitboxHeight);
    }

    // Helper methods
    isSpike() {
        return (
            this.id === Tile.SPIKE_1 ||
            this.id === Tile.SPIKE_2 ||
            this.id === Tile.SPIKE_3 ||
            this.id === Tile.POKER
        );
    }

    isPlatform() {
        return (
            this.id === Tile.PLATFORM_1 ||
            this.id === Tile.PLATFORM_2 ||
            this.id === Tile.PLATFORM_3 ||
            this.id === Tile.PLATFORM_4 ||
            this.id === Tile.PLATFORM_5 ||
            this.id === Tile.PLATFORM_6 ||
            this.id === Tile.PLATFORM_7 ||
            this.id === Tile.PLATFORM_8
        );
    }

    isCoin() {
        return this.id === Tile.COIN;
    }

    /**
     * Renders the tile at the specified grid coordinates
     */
    render(x, y) {
        const pixelX = x * Tile.SIZE;
        const pixelY = y * Tile.SIZE;

        this.sprites[this.id].render(pixelX, pixelY);
    }
}
