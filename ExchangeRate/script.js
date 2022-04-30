// @ts-check


class CurrencyExchange
{
    /**
     * 
     * @param {HTMLSelectElement} fromCurrencyElement 
     * @param {HTMLInputElement} fromCurrencyInput
     * @param {HTMLSelectElement} toCurrencyElement 
     * @param {HTMLInputElement} toCurrencyInput
     * @param {HTMLButtonElement} swapButton
     * @param {HTMLDivElement} rateElement
     */
    constructor(fromCurrencyElement, fromCurrencyInput, toCurrencyElement, toCurrencyInput, swapButton, rateElement)
    {
        this.fromCurrencyElement = fromCurrencyElement;
        this.fromCurrencyInput = fromCurrencyInput;
        this.toCurrencyElement = toCurrencyElement;
        this.toCurrencyInput = toCurrencyInput;
        this.swapButton = swapButton;
        this.rateElement = rateElement;

        this.exchangeData = null;
        // to currency input should be readonly
        this.toCurrencyInput.readOnly = true;

        this.initialize();
    }

    async initialize()
    {
        let res = await fetch('https://open.exchangerate-api.com/v6/latest');
        this.exchangeData = await res.json();
        this.initializeCurrencySelectElement(this.fromCurrencyElement);
        this.initializeCurrencySelectElement(this.toCurrencyElement);

        this.fromCurrencyElement.addEventListener('change', this.calculate.bind(this));
        this.fromCurrencyInput.addEventListener('input', this.calculate.bind(this));
        this.toCurrencyElement.addEventListener('change', this.calculate.bind(this));
        this.swapButton.addEventListener('click', this.swap.bind(this));
        this.calculate();
    }

    /**
     * @param {HTMLSelectElement} currencySelectElement 
     */
    initializeCurrencySelectElement(currencySelectElement)
    {
        for (let currency in this.exchangeData.rates)
        {
            /** @type {HTMLOptionElement} */
            let optionElement = document.createElement('option');
            optionElement.value = currency;
            optionElement.innerHTML = currency;
            currencySelectElement.add(optionElement);
        }
    }

    calculate()
    {
        if (!this.exchangeData)
        {
            console.log('Please wait for http response');
            return;
        }
        let fromCurrency = this.fromCurrencyElement.value;
        let toCurrency = this.toCurrencyElement.value;
        let rate = this.exchangeData.rates[toCurrency] / this.exchangeData.rates[fromCurrency];
        this.rateElement.innerHTML = `1 ${fromCurrency} = ${rate.toFixed(2)} ${toCurrency}`
        this.toCurrencyInput.value = (Number(this.fromCurrencyInput.value) * rate).toFixed(2);
    }

    swap()
    {
        [this.fromCurrencyElement.value, this.toCurrencyElement.value] = [this.toCurrencyElement.value, this.fromCurrencyElement.value];
        this.calculate();
    }
}


let currencyExchange = new CurrencyExchange(
    // @ts-ignore
    document.getElementById('currency-one'),
    // @ts-ignore
    document.getElementById('amount-one'),
    // @ts-ignore
    document.getElementById('currency-two'),
    // @ts-ignore
    document.getElementById('amount-two'),
    // @ts-ignore
    document.getElementById('swap'),
    // @ts-ignore
    document.getElementById('rate'),
);
