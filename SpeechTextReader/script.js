// @ts-check

class SpeechTextReader {
    constructor() {
        /** @type {HTMLSelectElement} */
        // @ts-ignore
        this.voiceSelect = document.getElementById('voices');
        /** @type {HTMLTextAreaElement} */
        // @ts-ignore
        this.textarea = document.getElementById('text');
        /** @type {Array<SpeechSynthesisVoice>} */
        this.voices = [];
        this.populateVoiceList();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.addEventListener('voiceschanged', this.populateVoiceList.bind(this));
        }
        document.getElementById('read').addEventListener('click', this.handleReadText.bind(this));
    }

    populateVoiceList() {
        const voices = window.speechSynthesis.getVoices();
        for (const voice of voices) {
            if (this.voices.includes(voice)) {
                continue;
            }
            this.voices.push(voice);
            const optionElement = document.createElement('option');
            optionElement.value = voice.name;
            if (voice.default) {
                optionElement.defaultSelected = true;
            }
            optionElement.innerText = `${voice.name} (${voice.lang})`;
            this.voiceSelect.appendChild(optionElement);
        }
    }

    handleReadText() {
        const voiceName = this.voiceSelect.selectedOptions[0].value;
        for (const voice of this.voices) {
            if (voice.name !== voiceName) {
                continue;
            }
            const utterance = new SpeechSynthesisUtterance(this.textarea.value);
            utterance.voice = voice;
            window.speechSynthesis.speak(utterance);
            return;
        }
    }
}

const speechTextReader = new SpeechTextReader();
