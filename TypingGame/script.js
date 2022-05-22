// @ts-check

import { words } from './words.js';

class Difficulty {
    static EASY = 'easy';
    static MEDIUM = 'medium';
    static HARD = 'hard';
}

const DifficultyTimeMap = {
    [Difficulty.EASY]: 5,
    [Difficulty.MEDIUM]: 3,
    [Difficulty.HARD]: 2,
};

class TypingGame {
    constructor() {
        this.wordElement = document.getElementById('word');
        this.scoreElement = document.getElementById('score');
        this.timeElement = document.getElementById('time');
        this.endGameElement = document.getElementById('end-game-container');
        this.settings = document.getElementById('settings');
        this.difficulty = Difficulty.MEDIUM;
        this.timer = null;
        this.word = '';
        this.score = 0;
        this.time = 0;
        const text = document.getElementById('text');
        text.focus();
        text.addEventListener('input', this.onTextInput.bind(this));
        document.getElementById('settings-btn').addEventListener('click', this.toggleSettings.bind(this));
        document.getElementById('settings-form').addEventListener('change', this.onSettingsChanged.bind(this));
        // @ts-ignore
        document.getElementById('difficulty').value = this.difficulty;
        this.gameStart();
    }

    gameStart() {
        this.generateRandomWord();
        this.score = 0;
        this.time = 10;
        this.timer = setInterval(this.updateTime.bind(this), 1000);
    }

    gameOver() {
        this.endGameElement.innerHTML = `
            <h1>Time ran out</h1>
            <p>Your final score: ${this.score}</p>
            <button onclick="location.reload()">Reload</button>
        `;
        this.endGameElement.style.display = 'flex';
    }

    onTextInput(event) {
        if (event.target.value === this.word) {
            event.target.value = '';
            this.increaseScore();
            this.generateRandomWord();
            this.time += DifficultyTimeMap[this.difficulty];
            this.updateTime(false);
        }
    }

    toggleSettings() {
        this.settings.classList.toggle('hide');
    }

    onSettingsChanged(event) {
        this.difficulty = event.target.value;
    }

    generateRandomWord() {
        let word;
        do {
            word = words[Math.floor(Math.random() * words.length)];
        } while (word === this.word);
        this.word = word;
        this.wordElement.innerText = word;
    }

    updateTime(isReduceTime = true) {
        if (isReduceTime) {
            this.time--;
        }
        this.timeElement.innerText = String(this.time);
        if (this.time <= 0) {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            this.gameOver();
        }
    }

    increaseScore() {
        this.score++;
        this.scoreElement.innerText = String(this.score);
    }
}

const typingGame = new TypingGame();
