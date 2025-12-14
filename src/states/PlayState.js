import State from "../../lib/State.js";
import Map from "../services/Map.js";
import Player from "../entities/player/Player.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import GameStateName from "../enums/GameStateName.js";
import ImageName from "../enums/ImageName.js";
import Camera from "../services/Camera.js";
import ScorePanel from "../user-interface/elements/ScorePanel.js";
import Factory from "../services/Factory.js";
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

        // Reset coin counter
        this.player.coinsCollected = 0;

        // Reset player to falling state
        this.player.stateMachine.change(PlayerStateName.Falling);

        // Reset score panel with new map's total coins
        this.scorePanel = new ScorePanel(0, this.map.totalCoins);

        this.player.playState = this;

        // Respawn enemies
        this.enemies = [];
        this.spawnEnemies();
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

            stateMachine.change(GameStateName.Transition, {
                fromState: this,
                toStateName: GameStateName.Victory,
            });
        }

        // Check for game over condition
        if (this.player.hasDied) {
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
