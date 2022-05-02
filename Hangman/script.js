// @ts-check

class HangmanGame {
    /**
     *
     * @param {Array<string>} availableWords
     * @param {HTMLDivElement} wordElement
     * @param {HTMLDivElement} wrongLettersElement
     * @param {HTMLButtonElement} playAgainButton
     * @param {HTMLDivElement} popupElement
     * @param {HTMLDivElement} notificationElement
     * @param {HTMLHeadingElement} finalMessageElement
     * @param {HTMLHeadingElement} revealWordElement
     * @param {Array<SVGLineElement>} figureParts
     */
    constructor(
        availableWords,
        wordElement,
        wrongLettersElement,
        playAgainButton,
        popupElement,
        notificationElement,
        finalMessageElement,
        revealWordElement,
        figureParts
    ) {
        this.availableWords = availableWords;
        this.wordElement = wordElement;
        this.wrongLettersElement = wrongLettersElement;
        this.playAgainButton = playAgainButton;
        this.popupElement = popupElement;
        this.notificationElement = notificationElement;
        this.finalMessageElement = finalMessageElement;
        this.revealWordElement = revealWordElement;
        this.figureParts = figureParts;

        this.selectedWord = '';
        this.isPlayable = false;
        this.correctLetters = [];
        this.wrongLetters = [];
        this.validKeyCode = /^Key[A-Z]$/;

        this.playAgainButton.addEventListener('click', this.gameStart.bind(this));
    }

    /**
     * Start the game
     */
    gameStart() {
        this.selectedWord = this.randomWord();
        this.correctLetters = [];
        this.wrongLetters = [];
        this.displayWord();
        this.displayWrongLetters();
        this.isPlayable = true;
        this.popupElement.style.display = 'none';
    }

    gameWin() {
        this.finalMessageElement.innerText = 'You win!';
        this.revealWordElement.innerText = '';
        this.popupElement.style.display = 'flex';
        this.isPlayable = false;
    }

    gameLose() {
        this.finalMessageElement.innerText = 'You lose.';
        this.revealWordElement.innerText = `the word was: ${this.selectedWord}`;
        this.popupElement.style.display = 'flex';
        this.isPlayable = false;
    }

    /**
     * random choose a word from availableWords
     * @returns {string}
     */
    randomWord() {
        return this.availableWords[Math.floor(Math.random() * this.availableWords.length)];
    }

    displayWord() {
        let letterHtmls = [];
        for (const letter of this.selectedWord) {
            letterHtmls.push(`<span class="letter">${this.correctLetters.includes(letter) ? letter : ''}</span>`);
        }
        this.wordElement.innerHTML = letterHtmls.join('');
    }

    displayWrongLetters() {
        this.wrongLettersElement.innerHTML = `
            ${this.wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
            ${this.wrongLetters.map((letter) => `<span>${letter}</span>`)}
        `;
        const errorCount = this.wrongLetters.length;
        this.figureParts.forEach((part, index) => {
            if (index < errorCount) {
                part.style.display = 'block';
            } else {
                part.style.display = 'none';
            }
        });
    }

    trySettleGame() {
        if (this.wrongLetters.length == this.figureParts.length) {
            this.gameLose();
            return;
        }
        if (this.wordElement.innerText.replace(/[ \n\r]/g, '') === this.selectedWord) {
            this.gameWin();
        }
    }

    /**
     * @param {string} message
     */
    showNotification(message) {
        const paragraphElement = this.notificationElement.querySelector('p');
        paragraphElement.innerText = message;
        this.notificationElement.classList.add('show');
        setTimeout(() => {
            this.notificationElement.classList.remove('show');
        }, 2000);
    }

    /**
     * @param {KeyboardEvent} event
     */
    onKeydown(event) {
        const inputKeyCode = event.code;
        if (!this.isPlayable) {
            if (inputKeyCode === 'Enter') {
                this.gameStart();
                return;
            }
            this.showNotification(
                'You are not in game, please click the "Play Again" button or press the "Enter" key.'
            );
            return;
        }
        if (!this.validKeyCode.test(inputKeyCode)) {
            this.showNotification(`Please enter a letter, not "${event.key}"`);
            return;
        }
        const inputLetter = event.key.toLowerCase();
        if (this.selectedWord.includes(inputLetter)) {
            if (this.correctLetters.includes(inputLetter)) {
                this.showNotification(`You have already enterred "${inputLetter}"`);
            } else {
                this.correctLetters.push(inputLetter);
                this.displayWord();
            }
        } else {
            if (this.wrongLetters.includes(inputLetter)) {
                this.showNotification(`You have already enterred "${inputLetter}"`);
            } else {
                this.wrongLetters.push(inputLetter);
                this.displayWrongLetters();
            }
        }
        this.trySettleGame();
    }
}

let game = new HangmanGame(
    ['application', 'programming', 'interface', 'wizard'],
    // @ts-ignore
    document.getElementById('word'),
    document.getElementById('wrong-letters'),
    document.getElementById('play-button'),
    document.getElementById('popup-container'),
    document.getElementById('notification-container'),
    document.getElementById('final-message'),
    document.getElementById('final-message-reveal-word'),
    document.querySelectorAll('.figure-part')
);

window.addEventListener('keydown', game.onKeydown.bind(game));
game.gameStart();
