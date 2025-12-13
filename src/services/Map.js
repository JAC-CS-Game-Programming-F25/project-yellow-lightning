import Sprite from "../../lib/Sprite.js";
import Tile from "./Tile.js";
import Layer from "./Layer.js";

/**
 * Represents the game map, including layers.
 */
export default class Map {
    /**
     * The index of the foreground layer in the layers array.
     * @type {number}
     */
    static FOREGROUND_LAYER = 0;

    /**
     * Creates a new Map instance.
     * @param {Object} mapDefinition - The map definition object, typically loaded from a JSON file.
     * @param {Graphic} tilesetImage - The tileset image to use for rendering.
     */
    constructor(mapDefinition, tilesetImage) {
        this.width = mapDefinition.width;
        this.height = mapDefinition.height;
        this.tileSize = mapDefinition.tilewidth;
        this.tilesets = mapDefinition.tilesets;

        // Generate sprites from the tileset image with spacing
        const sprites = Sprite.generateSpritesFromSpriteSheet(
            tilesetImage,
            this.tileSize,
            this.tileSize
        );

        // Create Layer instances for each layer in the map definition
        this.layers = mapDefinition.layers.map(
            (layerData) => new Layer(layerData, sprites)
        );
        this.foregroundLayer = this.layers[Map.FOREGROUND_LAYER];
    }

    /**
     * Updates the map.
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {}

    /**
     * Renders the map and all its layers.
     * @param {CanvasRenderingContext2D} context - The rendering context.
     */
    render(context) {
        // Render all layers
        this.layers.forEach((layer) => layer.render());
    }

    /**
     * Gets a tile from a specific layer at the given column and row.
     * @param {number} layerIndex - The index of the layer.
     * @param {number} col - The column of the tile.
     * @param {number} row - The row of the tile.
     * @returns {Tile|null} The tile at the specified position, or null if no tile exists.
     */
    getTileAt(layerIndex, col, row) {
        return this.layers[layerIndex].getTile(col, row);
    }

    /**
     * Checks if there's a solid tile at the specified column and row.
     * @param {number} col - The column to check.
     * @param {number} row - The row to check.
     * @returns {boolean} True if there's a solid tile, false otherwise.
     */
    isSolidTileAt(col, row) {
        const tile = this.foregroundLayer.getTile(col, row);
        return tile !== null && tile.id !== -1;
    }

    /**
     * Checks if tile is a phase-through tile.
     * Player can pass through these tiles.
     * @param {number} row - The row to check.
     * @param {number} col - The column to check.
     * @returns {boolean} True if tile is a chain tile, false otherwise.
     */
    isPhaseThrough(row, col) {
        const tile = this.foregroundLayer.getTile(col, row);
        if (!tile) return false;
        return (
            tile.id === Tile.CHAIN_1 ||
            tile.id === Tile.CHAIN_2 ||
            tile.id === Tile.CHAIN_3 ||
            tile.id === Tile.CHAIN_4 ||
            tile.id === Tile.CHAIN_5
        );
    }

    /**
     * Checks if tile is a platform block.
     * Can land on top, deadly on sides.
     * @param {number} row - The row to check.
     * @param {number} col - The column to check.
     * @returns {boolean} True if tile is a platform block, false otherwise.
     */
    isPlatformTile(row, col) {
        const tile = this.foregroundLayer.getTile(col, row);
        if (!tile) return false;
        return (
            tile.id === Tile.PLATFORM_1 ||
            tile.id === Tile.PLATFORM_2 ||
            tile.id === Tile.PLATFORM_3 ||
            tile.id === Tile.PLATFORM_4
        );
    }

    /**
     * Checks if tile is deadly (spikes/posts).
     * Instant death on any contact.
     * @param {number} row - The row to check.
     * @param {number} col - The column to check.
     * @returns {boolean} True if tile is deadly, false otherwise.
     */
    isDeadlyTile(row, col) {
        const tile = this.foregroundLayer.getTile(col, row);
        if (!tile) return false;

        return (
            tile.id === Tile.SPIKE_1 ||
            tile.id === Tile.SPIKE_2 ||
            tile.id === Tile.SPIKE_3 ||
            tile.id === Tile.POST
        );
    }

    /**
     * Gets a block at the specified coordinates.
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     * @returns {null} Currently returns null as blocks are not implemented yet.
     */
    getBlockAt(x, y) {
        return null;
    }
}
