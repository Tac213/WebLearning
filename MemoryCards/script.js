// @ts-check

class Card {
    /**
     * @param {string} question
     * @param {string} answer
     */
    constructor(question, answer) {
        this.question = question;
        this.answer = answer;
    }

    /**
     * @returns {string}
     */
    generateHTML() {
        return `
            <div class="inner-card">
                <div class="inner-card-front"><p>${this.question}</p></div>
                <div class="inner-card-back"><p>${this.answer}</p></div>
            </div>
        `;
    }

    /**
     * @param {boolean} isActivate
     * @returns {HTMLElement}
     */
    createElement(isActivate) {
        const element = document.createElement('div');
        element.classList.add('card');
        if (isActivate) element.classList.add('active');
        element.innerHTML = this.generateHTML();
        element.addEventListener('click', () => element.classList.toggle('show-answer'));
        return element;
    }

    /**
     * @param {{question: string, answer: string}} object
     */
    static createWithJson(object) {
        const card = new Card(object.question, object.answer);
        return card;
    }
}

class AddCardView {
    constructor() {
        this.addContainer = document.getElementById('add-container');
        /** @type {HTMLInputElement} */
        // @ts-ignore
        this.questrionElement = document.getElementById('question');
        /** @type {HTMLInputElement} */
        // @ts-ignore
        this.answerElement = document.getElementById('answer');
        this.cardsView = null;
    }

    /**
     * @param {boolean} isVisible
     */
    setVisible(isVisible) {
        if (isVisible) {
            this.addContainer.classList.add('show');
        } else {
            this.addContainer.classList.remove('show');
        }
    }

    addCard() {
        const question = this.questrionElement.value;
        const answer = this.answerElement.value;
        if (!question.trim() || !answer.trim()) {
            alert('Both question and answer should be typed in');
            return;
        }
        const card = new Card(question, answer);
        this.cardsView.addCardElement(card);
        this.setVisible(false);
    }

    /**
     *
     * @param {CardsView} cardsView
     */
    setCardsView(cardsView) {
        this.cardsView = cardsView;
    }
}

class CardsView {
    constructor() {
        this.cardsContainer = document.getElementById('cards-container');
        this.currentElement = document.getElementById('current');
        /** @type {Array<HTMLElement>} */
        this.cardElements = [];
        this.cards = this.getCards();
        this.currentActivateIndex = -1;
        for (const card of this.cards) {
            this.addCardElement(card, true);
        }
        this.showLastCard();
    }

    /**
     * @param {Card} card
     * @param {boolean} isInitialization
     */
    addCardElement(card, isInitialization = false) {
        if (!isInitialization) this.cards.push(card);
        const cardElement = card.createElement(false);
        this.cardElements.push(cardElement);
        this.cardsContainer.appendChild(cardElement);
        if (!isInitialization) this.showLastCard();
        if (!isInitialization) this.setCardsData();
    }

    updateCurrentText() {
        this.currentElement.innerText = `${this.currentActivateIndex + 1} / ${this.cardElements.length}`;
    }

    showLastCard() {
        const currentIndex = this.currentActivateIndex;
        this.currentActivateIndex = this.cards.length - 1;
        if (currentIndex >= 0) {
            this.cardElements[currentIndex].classList.remove('active');
            this.cardElements[currentIndex].classList.add('left');
        }
        if (this.currentActivateIndex >= 0) {
            this.cardElements[this.currentActivateIndex].classList.remove('right');
            this.cardElements[this.currentActivateIndex].classList.add('active');
        }
        this.updateCurrentText();
    }

    showNextCard() {
        const currentIndex = this.currentActivateIndex;
        this.modifyCurrentActivateIndex(true);
        if (currentIndex === this.currentActivateIndex) return;
        this.cardElements[currentIndex].classList.remove('active');
        this.cardElements[currentIndex].classList.add('left');
        this.cardElements[this.currentActivateIndex].classList.remove('right');
        this.cardElements[this.currentActivateIndex].classList.add('active');
        this.updateCurrentText();
    }

    showPrevCard() {
        const currentIndex = this.currentActivateIndex;
        this.modifyCurrentActivateIndex(false);
        if (currentIndex === this.currentActivateIndex) return;
        this.cardElements[currentIndex].classList.remove('active');
        this.cardElements[currentIndex].classList.add('right');
        this.cardElements[this.currentActivateIndex].classList.remove('left');
        this.cardElements[this.currentActivateIndex].classList.add('active');
        this.updateCurrentText();
    }

    /**
     * @param {boolean} isPlus
     */
    modifyCurrentActivateIndex(isPlus) {
        if (isPlus) {
            this.currentActivateIndex++;
        } else {
            this.currentActivateIndex--;
        }
        this.currentActivateIndex = Math.max(0, Math.min(this.cards.length - 1, this.currentActivateIndex));
    }

    clearCards() {
        this.cardsContainer.innerHTML = '';
        this.currentActivateIndex = -1;
        this.cards = [];
        this.cardElements = [];
        this.setCardsData();
        this.updateCurrentText();
    }

    setCardsData() {
        localStorage.setItem('cards', JSON.stringify(this.cards));
    }

    getCards() {
        const cardDatas = JSON.parse(localStorage.getItem('cards'));
        if (!cardDatas) {
            return [];
        }
        let cards = [];
        for (const cardData of cardDatas) {
            cards.push(Card.createWithJson(cardData));
        }
        return cards;
    }
}

const addCardView = new AddCardView();
document.getElementById('show').addEventListener('click', () => addCardView.setVisible(true));
document.getElementById('hide').addEventListener('click', () => addCardView.setVisible(false));
document.getElementById('add-card').addEventListener('click', addCardView.addCard.bind(addCardView));

const cardsView = new CardsView();
addCardView.setCardsView(cardsView);
document.getElementById('prev').addEventListener('click', cardsView.showPrevCard.bind(cardsView));
document.getElementById('next').addEventListener('click', cardsView.showNextCard.bind(cardsView));
document.getElementById('clear').addEventListener('click', cardsView.clearCards.bind(cardsView));
