/**
 * SaveManager handles all game persistence using localStorage.
 * Saves high scores and in-game progress.
 */
export default class SaveManager {
    static SAVE_KEY = "yellowLightning";

    /**
     * Saves high scores for all levels
     * @param {Object} highScores - Object with level numbers as keys and scores as values
     */
    static saveHighScores(highScores) {
        const saveData = this.loadAllData();
        saveData.highScores = highScores;
        localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
    }

    /**
     * Loads high scores from storage
     * @returns {Object} High scores object or default values
     */
    static loadHighScores() {
        const saveData = this.loadAllData();
        return saveData.highScores || { 1: 0, 2: 0, 3: 0 };
    }

    /**
     * Saves in-game progress called every 2 seconds during gameplay
     * @param {number} level - Current level number
     * @param {number} playerX - Player X position
     * @param {number} playerY - Player Y position
     * @param {number} coinsCollected - Number of coins collected
     * @param {Array} collectedCoinPositions - Array of {x, y} positions of collected coins
     */
    static saveGameProgress(
        level,
        playerX,
        playerY,
        coinsCollected,
        collectedCoinPositions
    ) {
        const saveData = this.loadAllData();
        saveData.gameProgress = {
            level: level,
            playerX: playerX,
            playerY: playerY,
            coinsCollected: coinsCollected,
            collectedCoinPositions: collectedCoinPositions,
            timestamp: Date.now(),
        };
        localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
    }

    /**
     * Loads saved game progress
     * @returns {Object|null} Game progress object or null if no save exists
     */
    static loadGameProgress() {
        const saveData = this.loadAllData();
        return saveData.gameProgress || null;
    }

    /**
     * Clears the saved game progress
     */
    static clearGameProgress() {
        const saveData = this.loadAllData();
        saveData.gameProgress = null;
        localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
    }

    /**
     * Loads all save data from localStorage
     * @returns {Object} Complete save data object
     */
    static loadAllData() {
        const data = localStorage.getItem(this.SAVE_KEY);
        if (data) {
            return JSON.parse(data);
        }
        return { highScores: { 1: 0, 2: 0, 3: 0 }, gameProgress: null };
    }

    /**
     * Clears all saved data (for demo
     */
    static clearAllData() {
        localStorage.removeItem(this.SAVE_KEY);
    }
}
