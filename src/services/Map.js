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
}
