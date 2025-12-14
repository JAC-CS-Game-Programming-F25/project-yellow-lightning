import Fonts from "../lib/Fonts.js";
import Images from "../lib/Images.js";
import Sounds from "../lib/Sounds.js";
import StateMachine from "../lib/StateMachine.js";
import Timer from "../lib/Timer.js";
import Input from "../lib/Input.js";

export const canvas = document.createElement("canvas");
export const context =
    canvas.getContext("2d") || new CanvasRenderingContext2D();

// Canvas dimensions
export const TILE_SIZE = 16;
export const CANVAS_WIDTH = TILE_SIZE * 25;
export const CANVAS_HEIGHT = TILE_SIZE * 19;

const resizeCanvas = () => {
    const scaleX = window.innerWidth / CANVAS_WIDTH;
    const scaleY = window.innerHeight / CANVAS_HEIGHT;
    const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio

    canvas.style.width = `${CANVAS_WIDTH * scale}px`;
    canvas.style.height = `${CANVAS_HEIGHT * scale}px`;
};

// Listen for canvas resize events
window.addEventListener("resize", resizeCanvas);

resizeCanvas(); // Call once to scale initially

export const keys = {};
export const images = new Images(context);
export const fonts = new Fonts();
export const stateMachine = new StateMachine();
export const timer = new Timer();
export const input = new Input(canvas);
export const sounds = new Sounds();

// Level management
export let levelDefinitions = {};
export let currentLevel = 1;

// High scores - stored as { levelNumber: score }
export let highScores = {
    1: 0,
    2: 0,
    3: 0,
};

export function setLevelDefinitions(definitions) {
    levelDefinitions = definitions;
}

export function setCurrentLevel(level) {
    currentLevel = level;
}

/**
 * Updates the high score for a level if the new score is better.
 * @param {number} levelNumber - The level number.
 * @param {number} score - The score to compare.
 */
export function updateHighScore(levelNumber, score) {
    if (!highScores[levelNumber] || score > highScores[levelNumber]) {
        highScores[levelNumber] = score;
    }
}

/**
 * Gets the high score for a specific level.
 * @param {number} levelNumber - The level number.
 * @returns {number} The high score for that level.
 */
export function getHighScore(levelNumber) {
    return highScores[levelNumber] || 0;
}
