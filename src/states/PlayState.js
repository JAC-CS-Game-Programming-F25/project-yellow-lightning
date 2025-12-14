import State from "../../lib/State.js";
import Map from "../services/Map.js";
import Player from "../entities/player/Player.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import GameStateName from "../enums/GameStateName.js";
import ImageName from "../enums/ImageName.js";
import Camera from "../services/Camera.js";
import ScorePanel from "../user-interface/elements/ScorePanel.js";
import Factory from "../services/Factory.js";
import SaveManager from "../services/SaveManager.js";
import {
    loadEnemySprites,
    skullSpriteConfig,
} from "../../config/SpriteConfig.js";
import {
    images,
    context,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    stateMachine,
    levelDefinitions,
    currentLevel,
    updateHighScore,
} from "../globals.js";

/**
 * Represents the main play state of the game.
 * @extends State
 */
export default class PlayState extends State {
    /**
     * Creates a new PlayState instance.
     * @param {Object} mapDefinition - The definition object for the game map (optional, uses currentLevel if not provided).
     */
    constructor(mapDefinition = null) {
        super();

        // Use provided map definition or load from current level
        const levelToLoad = mapDefinition || levelDefinitions[currentLevel];

        this.map = new Map(levelToLoad, images.get(ImageName.Tiles));

        // Create player at starting position
        this.player = new Player(2 * 16, 15 * 16, 16, 16, this.map);
        this.player.playState = this;

        // Start player in falling state
        this.player.stateMachine.change(PlayerStateName.Falling);

        // Create camera to follow the player
        this.camera = new Camera(
            this.player,
            CANVAS_WIDTH,
            CANVAS_HEIGHT,
            this.map.width * 16,
            this.map.height * 16
        );

        // Create score panel
        this.scorePanel = new ScorePanel(0, this.map.totalCoins);

        // Initialize enemies array
        this.enemies = [];
        this.spawnEnemies();

        // Initialize autosave timer
        this.autosaveTimer = 0;
        this.AUTOSAVE_INTERVAL = 2; // Save every 2 seconds

        // Track collected coin positions for saving
        this.collectedCoinPositions = [];
    }

    /**
     * Spawns enemies from level data.
     */
    spawnEnemies() {
        // Load skull sprites
        const skullSprites = loadEnemySprites(
            images.get(ImageName.Tiles),
            skullSpriteConfig
        );

        // Get current level definition
        const levelToLoad = levelDefinitions[currentLevel];

        // Check if level has enemy data
        if (levelToLoad.enemies && levelToLoad.enemies.length > 0) {
            // Spawn enemies from level data
            levelToLoad.enemies.forEach((enemyData) => {
                this.enemies.push(
                    Factory.createEnemy(
                        enemyData.type,
                        skullSprites,
                        enemyData.x,
                        enemyData.y,
                        enemyData.moving
                    )
                );
            });
        }
    }

    /**
     * Tracks a collected coin position and removes it from the map
     * @param {number} x - Tile X coordinate
     * @param {number} y - Tile Y coordinate
     */
    collectCoin(x, y) {
        // Add to collected positions list
        this.collectedCoinPositions.push({ x: x, y: y });
        // Remove from map
        this.map.removeTile(x, y);
    }

    /**
     * Called when entering the play state.
     * Resets the player's position and flags for a fresh start.
     */
    enter() {
        // Reload the map for the current level
        const levelToLoad = levelDefinitions[currentLevel];
        this.map = new Map(levelToLoad, images.get(ImageName.Tiles));
        this.player.map = this.map;

        // Then point the collision detector to the ne map
        const states = this.player.stateMachine.states;
        for (let stateName in states) {
            if (states[stateName].collisionDetector) {
                states[stateName].collisionDetector.map = this.map;
            }
        }

        // Update camera for map dimensions
        this.camera = new Camera(
            this.player,
            CANVAS_WIDTH,
            CANVAS_HEIGHT,
            this.map.width * 16,
            this.map.height * 16
        );

        // Reset player position to start
        this.player.position.set(
            this.player.initialPosition.x,
            this.player.initialPosition.y
        );

        // Reset win/lose flags
        this.player.hasWon = false;
        this.player.hasDied = false;

        // Reset coin counter and collected positions
        this.player.coinsCollected = 0;
        this.collectedCoinPositions = [];

        // Reset player to falling state
        this.player.stateMachine.change(PlayerStateName.Falling);

        // Reset score panel with new map's total coins
        this.scorePanel = new ScorePanel(0, this.map.totalCoins);

        this.player.playState = this;

        // Respawn enemies
        this.enemies = [];
        this.spawnEnemies();

        // Try to load saved game progress
        const savedProgress = SaveManager.loadGameProgress();
        if (savedProgress && savedProgress.level === currentLevel) {
            // Restore player position
            this.player.position.set(
                savedProgress.playerX,
                savedProgress.playerY
            );

            // Restore coins collected count
            this.player.coinsCollected = savedProgress.coinsCollected;
            this.scorePanel.updateScore(savedProgress.coinsCollected);

            // Restore collected coin positions by removing those coins from the map
            if (
                savedProgress.collectedCoinPositions &&
                savedProgress.collectedCoinPositions.length > 0
            ) {
                savedProgress.collectedCoinPositions.forEach((coinPos) => {
                    this.map.removeTile(coinPos.x, coinPos.y);
                });
                // Copy the collected positions array
                this.collectedCoinPositions = [
                    ...savedProgress.collectedCoinPositions,
                ];
            }
        }

        // Reset autosave timer
        this.autosaveTimer = 0;
    }

    /**
     * Checks if player is colliding with any enemies.
     * This is called from PlayerState to check enemy collisions.
     * @returns {boolean} True if collision with enemy occurred, false otherwise.
     */
    checkEnemyCollisions() {
        for (let enemy of this.enemies) {
            if (!enemy.isDead && this.player.collidesWith(enemy)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Updates the play state.
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {
        this.map.update(dt);

        // Autosave progress every 2 seconds
        this.autosaveTimer += dt;
        if (this.autosaveTimer >= this.AUTOSAVE_INTERVAL) {
            this.autosaveTimer = 0;
            SaveManager.saveGameProgress(
                currentLevel,
                this.player.position.x,
                this.player.position.y,
                this.player.coinsCollected,
                this.collectedCoinPositions
            );
        }

        this.player.update(dt);
        this.camera.update(dt);

        // Update all enemies
        this.enemies.forEach((enemy) => enemy.update(dt));

        // Update score panel
        this.scorePanel.updateScore(this.player.coinsCollected);

        // Check for victory condition
        if (this.player.hasWon) {
            // Update high score with coins collected
            updateHighScore(currentLevel, this.player.coinsCollected);

            // Clear saved progress since level is complete
            SaveManager.clearGameProgress();

            stateMachine.change(GameStateName.Transition, {
                fromState: this,
                toStateName: GameStateName.Victory,
            });
        }

        // Check for game over condition
        if (this.player.hasDied) {
            // Clear saved progress on death
            SaveManager.clearGameProgress();

            stateMachine.change(GameStateName.Transition, {
                fromState: this,
                toStateName: GameStateName.GameOver,
            });
        }
    }

    /**
     * Renders the play state.
     * @param {CanvasRenderingContext2D} context - The rendering context.
     */
    render() {
        // Clear the canvas with sky blue background
        context.fillStyle = "#5C94FC";
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Apply camera transform
        this.camera.applyTransform(context);

        // Render game world
        this.map.render(context);

        // Render enemies
        this.enemies.forEach((enemy) => enemy.render(context));

        this.player.render(context);

        // Reset camera transform
        this.camera.resetTransform(context);

        // Render UI (score panel) without camera transform
        this.scorePanel.render();
    }
}
