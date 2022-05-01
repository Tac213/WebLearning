// @ts-check

class FormValidator {
    /**
     *
     * @param {HTMLFormElement} formElement
     * @param {HTMLInputElement} usernameInput
     * @param {HTMLInputElement} emailInput
     * @param {HTMLInputElement} passwordInput
     * @param {HTMLInputElement} passwordConfirmInput
     */
    constructor(formElement, usernameInput, emailInput, passwordInput, passwordConfirmInput) {
        this.formElement = formElement;
        this.usernameInput = usernameInput;
        this.emailInput = emailInput;
        this.passwordInput = passwordInput;
        this.passwordConfirmInput = passwordConfirmInput;
        this.emailRE =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        this.formElement.addEventListener('submit', this.validate.bind(this));
    }

    /**
     * @param {SubmitEvent} event
     */
    validate(event) {
        const inputElements = [this.usernameInput, this.emailInput, this.passwordInput, this.passwordConfirmInput];
        for (const inputElement of inputElements) {
            this.revertDefaultInputStatus(inputElement);
        }
        event.preventDefault();
        if (!this.checkRequired(inputElements)) {
            return;
        }
        if (!this.checkLength(this.usernameInput, 3, 25)) {
            return;
        }
        if (!this.checkEmail()) {
            return;
        }
        if (!this.checkLength(this.passwordInput, 8, 25)) {
            return;
        }
        if (!this.checkPasswordMatch()) {
            return;
        }
    }

    /**
     * @param {HTMLInputElement} inputElement
     */
    revertDefaultInputStatus(inputElement) {
        const formControl = inputElement.parentElement;
        formControl.className = 'form-control';
    }

    /**
     * @param {HTMLInputElement} inputElement
     */
    showSuccess(inputElement) {
        const formControl = inputElement.parentElement;
        formControl.className = 'form-control success';
    }

    /**
     * @param {HTMLInputElement} inputElement
     * @param {string} message
     */
    showError(inputElement, message) {
        const formControl = inputElement.parentElement;
        formControl.className = 'form-control error';
        const messageElement = formControl.querySelector('small');
        messageElement.innerHTML = message;
    }

    /**
     * @param {HTMLInputElement} inputElement
     * @returns {string}
     */
    getFieldName(inputElement) {
        const formControl = inputElement.parentElement;
        const labelElement = formControl.querySelector('label');
        return labelElement.innerText;
    }

    /**
     *
     * @param {Array<HTMLInputElement>} inputElements
     * @returns {boolean}
     */
    checkRequired(inputElements) {
        for (const inputElement of inputElements) {
            if (inputElement.value.trim() === '') {
                this.showError(inputElement, `${this.getFieldName(inputElement)} is requried`);
                return false;
            }
        }
        return true;
    }

    /**
     * @param {HTMLInputElement} inputElement
     * @param {number} minLength
     * @param {number} maxLength
     * @returns {boolean}
     */
    checkLength(inputElement, minLength, maxLength) {
        const inputLength = inputElement.value.length;
        if (inputLength < minLength) {
            this.showError(inputElement, `${this.getFieldName(inputElement)} must be at least ${minLength} characters`);
            return false;
        }
        if (inputLength > maxLength) {
            this.showError(
                inputElement,
                `${this.getFieldName(inputElement)} must be less than ${maxLength} characters`
            );
            return false;
        }
        this.showSuccess(inputElement);
        return true;
    }

    /**
     * @returns {boolean}
     */
    checkEmail() {
        if (!this.checkLength(this.emailInput, 3, 25)) {
            return false;
        }
        if (!this.emailRE.test(this.emailInput.value)) {
            this.showError(this.emailInput, 'Email is not valid');
            return false;
        }
        this.showSuccess(this.emailInput);
        return true;
    }

    checkPasswordMatch() {
        if (this.passwordInput.value !== this.passwordConfirmInput.value) {
            this.showError(this.passwordConfirmInput, 'Password does not match');
            return false;
        }
        this.showSuccess(this.passwordConfirmInput);
        return true;
    }
}

let formValidator = new FormValidator(
    // @ts-ignore
    document.getElementById('form'),
    document.getElementById('username'),
    document.getElementById('email'),
    document.getElementById('password'),
    document.getElementById('confirm-password')
);
