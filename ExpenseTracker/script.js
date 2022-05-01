// @ts-check

const EValidMoneyClass = {
    Income: 'income',
    Expense: 'expense',
};

const MONEY_FORMATTER = new Intl.NumberFormat('en-us', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
});

class Transaction {
    /**
     * @param {string} name
     * @param {number} amount
     */
    constructor(name, amount) {
        this.id = Math.floor(Math.random() * 100000000);
        this.name = name;
        this.isIncome = amount > 0;
        this.amount = Math.abs(amount);
    }

    /**
     * @returns {string}
     */
    format() {
        return MONEY_FORMATTER.format(this.amount);
    }

    /**
     * @param {{ name: string; amount: number; id: number; isIncome: boolean; }} obj
     * @returns {Transaction}
     */
    static createWithJson(obj) {
        let transaction = new Transaction(obj.name, obj.amount);
        transaction.id = obj.id;
        transaction.isIncome = obj.isIncome;
        return transaction;
    }
}

class ExpenseTracker {
    /**
     *
     * @param {HTMLHeadingElement} balanceElement
     * @param {HTMLParagraphElement} moneyIncomeElement
     * @param {HTMLParagraphElement} moneyExpenseElement
     * @param {HTMLUListElement} historyListElement
     * @param {HTMLFormElement} formElement
     * @param {HTMLInputElement} nameInput
     * @param {HTMLInputElement} amountInput
     */
    constructor(
        balanceElement,
        moneyIncomeElement,
        moneyExpenseElement,
        historyListElement,
        formElement,
        nameInput,
        amountInput
    ) {
        this.balanceElement = balanceElement;
        this.moneyIncomeElement = moneyIncomeElement;
        this.moneyExpenseElement = moneyExpenseElement;
        this.historyListElement = historyListElement;
        this.formElement = formElement;
        this.nameInput = nameInput;
        this.amountInput = amountInput;

        this.transactions = [];
        this.initializeTransaction();
        this.updateView();

        this.formElement.addEventListener('submit', this.addTransaction.bind(this));
    }

    updateView() {
        this.historyListElement.innerHTML = '';
        for (let transaction of this.transactions) {
            this.domAddTransaction(transaction);
        }
        this.updateValues();
    }

    /**
     * add transaction to DOM
     * @param {Transaction} transaction
     */
    domAddTransaction(transaction) {
        /** @type {HTMLLIElement} */
        let item = document.createElement('li');
        item.classList.add(transaction.isIncome ? EValidMoneyClass.Income : EValidMoneyClass.Expense);
        let sign = transaction.isIncome ? '+' : '-';
        item.innerHTML = `${
            transaction.name
        } <span>${sign}${transaction.format()}</span> <button class="delete-btn" onclick="expenseTracker.removeTransaction(${
            transaction.id
        })">x</button>`;
        this.historyListElement.appendChild(item);
    }

    /**
     *
     * @param {SubmitEvent} event
     */
    addTransaction(event) {
        event.preventDefault();
        if (this.nameInput.value.trim() === '' || this.amountInput.value.trim() === '') {
            alert('Please enter name and amount');
            return;
        }
        let transaction = new Transaction(this.nameInput.value, Number(this.amountInput.value));
        this.transactions.push(transaction);
        this.updateLocalStorage();
        this.updateView();
    }

    /**
     * @param {number} transactionId
     */
    removeTransaction(transactionId) {
        this.transactions = this.transactions.filter((transaction) => transaction.id !== transactionId);

        this.updateLocalStorage();
        this.updateView();
    }

    initializeTransaction() {
        let localStorageTransaction = localStorage.getItem('transactions');
        let transactions = localStorageTransaction !== null ? JSON.parse(localStorageTransaction) : [];
        for (let obj of transactions) {
            if (!obj) {
                continue;
            }
            this.transactions.push(Transaction.createWithJson(obj));
        }
    }

    updateLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }

    /**
     * update balance income expense
     */
    updateValues() {
        let income = 0;
        let expense = 0;
        for (let transaction of this.transactions) {
            if (transaction.isIncome) {
                income += transaction.amount;
            } else {
                expense += transaction.amount;
            }
        }
        this.balanceElement.innerHTML = MONEY_FORMATTER.format(income - expense);
        this.moneyIncomeElement.innerHTML = MONEY_FORMATTER.format(income);
        this.moneyExpenseElement.innerHTML = MONEY_FORMATTER.format(expense);
    }
}

let expenseTracker = new ExpenseTracker(
    // @ts-ignore
    document.getElementById('balance'),
    document.getElementById('income'),
    document.getElementById('expense'),
    document.getElementById('list'),
    document.getElementById('form'),
    document.getElementById('name'),
    document.getElementById('amount')
);
