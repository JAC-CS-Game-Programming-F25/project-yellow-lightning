import Sprite from "../lib/Sprite.js";

/**
 * Configuration for player sprite frames.
 */
export const playerSpriteConfig = {
    // Idle animation
    idle: [{ x: 0, y: 204, width: 16, height: 16 }],
    // Running animation - 6 frames
    run: [
        { x: 0, y: 204, width: 16, height: 16 },
        { x: 17, y: 204, width: 16, height: 16 },
        { x: 34, y: 204, width: 16, height: 16 },
        { x: 51, y: 204, width: 16, height: 16 },
        { x: 68, y: 204, width: 16, height: 16 },
        { x: 85, y: 204, width: 16, height: 16 },
    ],
    // Jump animation
    jump: [{ x: 34, y: 204, width: 16, height: 16 }],
    // Fall animation
    fall: [
        { x: 85, y: 221, width: 16, height: 16 },
        { x: 85, y: 255, width: 16, height: 16 },
    ],

    death: [
        { x: 0, y: 272, width: 16, height: 16 },
        { x: 17, y: 272, width: 16, height: 16 },
        { x: 34, y: 272, width: 16, height: 16 },
        { x: 51, y: 272, width: 16, height: 16 },
        { x: 68, y: 272, width: 16, height: 16 },
    ],
    victory: [
        { x: 0, y: 204, width: 16, height: 16 },
        { x: 85, y: 255, width: 16, height: 16 },
        { x: 85, y: 221, width: 16, height: 16 },
    ],
};

export const skullSpriteConfig = [
    { x: 0, y: 323, width: 16, height: 16 },
    { x: 17, y: 323, width: 16, height: 16 },
];

/**
 * Loads player sprites from a sprite sheet based on the configuration.
 *
 * @param {Graphic} spriteSheet - The sprite sheet image
 * @param {Object} spriteConfig - Configuration object defining sprite positions
 * @returns {Object} Object containing arrays of Sprite objects for each animation
 */
export function loadPlayerSprites(spriteSheet, spriteConfig) {
    const sprites = {};

    for (const [animationName, frames] of Object.entries(spriteConfig)) {
        sprites[animationName] = frames.map(
            (frame) =>
                new Sprite(
                    spriteSheet,
                    frame.x,
                    frame.y,
                    frame.width,
                    frame.height
                )
        );
    }

    return sprites;
}

/**
 * Loads enemy sprites from a sprite sheet.
 * @param {Graphic} spriteSheet - The sprite sheet image
 * @param {Array} spriteConfig - Array of sprite frame configurations
 * @returns {Array} Array of Sprite objects
 */
export function loadEnemySprites(spriteSheet, spriteConfig) {
    return spriteConfig.map(
        (frame) =>
            new Sprite(spriteSheet, frame.x, frame.y, frame.width, frame.height)
    );
}
