// @ts-check

const msgEl = document.getElementById('msg');

const randomNum = getRandomNumber();

// @ts-ignore
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// @ts-ignore
let recognition = new window.SpeechRecognition();

// Start recognition and game
recognition.start();

/**
 * Capture user speak
 * @param {SpeechRecognitionEvent} e
 */
function onSpeak(e) {
    /** @type {SpeechRecognitionResultList} */
    const resultList = e.results;
    /** @type {SpeechRecognitionResult} */
    const result = resultList[0];
    /** @type {SpeechRecognitionAlternative} */
    const alternative = result[0];
    const msg = alternative.transcript;

    writeMessage(msg);
    checkNumber(msg);
}

/**
 * Write what user speaks
 * @param {string} msg
 */
function writeMessage(msg) {
    msgEl.innerHTML = `
    <div>You said: </div>
    <span class="box">${msg}</span>
  `;
}

/**
 * Check msg against number
 * @param {string} msg
 * @returns
 */
function checkNumber(msg) {
    const num = +msg;

    // Check if valid number
    if (Number.isNaN(num)) {
        msgEl.innerHTML += '<div>That is not a valid number</div>';
        return;
    }

    // Check in range
    if (num > 100 || num < 1) {
        msgEl.innerHTML += '<div>Number must be between 1 and 100</div>';
        return;
    }

    // Check number
    if (num === randomNum) {
        document.body.innerHTML = `
      <h2>Congrats! You have guessed the number! <br><br>
      It was ${num}</h2>
      <button class="play-again" id="play-again">Play Again</button>
    `;
    } else if (num > randomNum) {
        msgEl.innerHTML += '<div>GO LOWER</div>';
    } else {
        msgEl.innerHTML += '<div>GO HIGHER</div>';
    }
}

// Generate random number
function getRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

// Speak result
recognition.addEventListener('result', onSpeak);

// End SR service
recognition.addEventListener('end', () => recognition.start());

document.body.addEventListener('click', (e) => {
    // @ts-ignore
    if (e.target.id == 'play-again') {
        window.location.reload();
    }
});
