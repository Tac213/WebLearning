// @ts-check


class User
{
    /**
     * @param {string} firstName 
     * @param {string} lastName 
     */
    constructor(firstName, lastName)
    {
        this.name = `${firstName} ${lastName}`;
        this.money = Math.floor(Math.random() * 1_000_000);
    }
}


class DomArrayMethod
{
    /**
     * @param {HTMLElement} main
     * @param {HTMLButtonElement} addButon
     * @param {HTMLButtonElement} doubleButton
     * @param {HTMLButtonElement} filterButton
     * @param {HTMLButtonElement} sortButton
     * @param {HTMLButtonElement} calculateButton
     */
    constructor (main, addButon, doubleButton, filterButton, sortButton, calculateButton)
    {
        this.main = main;
        this.addButton = addButon;
        this.doubleButton = doubleButton;
        this.filterButton = filterButton;
        this.sortButton = sortButton;
        this.calculateButton = calculateButton;

        // https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
        this.moneyFormatter = new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        });
        this.users = [];
        this.fetchRandomUser();
        this.fetchRandomUser();
        this.fetchRandomUser();

        this.addButton.addEventListener('click', this.fetchRandomUser.bind(this));
        this.doubleButton.addEventListener('click', this.doubleMoney.bind(this));
        this.filterButton.addEventListener('click', this.discardPoorUser.bind(this));
        this.sortButton.addEventListener('click', this.sortByRichest.bind(this));
        this.calculateButton.addEventListener('click', this.calculateWealth.bind(this));

        /** @type {HTMLDivElement | null} */
        this.totalWealthElement = null;
    }

    async fetchRandomUser()
    {
        /**@type {Response} */
        let res = await fetch('https://randomuser.me/api');
        // for more infomation, visit: https://randomuser.me
        let userData = await res.json();

        let user = new User(userData.results[0].name.first, userData.results[0].name.last);
        this.addUser(user);
    }

    /**
     * add user
     * @param {User} user 
     */
    addUser(user)
    {
        this.users.push(user);
        this.updateDom();
    }

    /**
     * update DOM by this.users
     */
    updateDom()
    {
        this.main.innerHTML = '<h2><strong>Person</strong> Money</h2>';
        for (let user of this.users)
        {
            /**@type {HTMLDivElement} */
            let newElement = document.createElement('div');
            newElement.classList.add('person');
            newElement.innerHTML = `<strong>${user.name}</strong> ${this.moneyFormatter.format(user.money)}`;
            this.main.appendChild(newElement);
        }
        if (this.totalWealthElement)
        {
            this.totalWealthElement.style.visibility = 'hidden';
            this.main.appendChild(this.totalWealthElement);
        }
    }

    doubleMoney()
    {
        for (let user of this.users)
        {
            user.money *= 2;
        }
        this.updateDom();
    }

    sortByRichest()
    {
        this.users.sort((userA, userB) => userB.money - userA.money);
        this.updateDom();
    }

    calculateWealth()
    {
        let totalWealth = 0;
        for (let user of this.users)
        {
            totalWealth += user.money;
        }
        if (!this.totalWealthElement)
        {
            this.totalWealthElement = document.createElement('div');
            this.main.appendChild(this.totalWealthElement);
        }
        this.totalWealthElement.style.visibility = 'visible';
        this.totalWealthElement.innerHTML = `<h3>Total Wealth: <strong>${this.moneyFormatter.format(totalWealth)}</strong?</h3>`;
    }

    discardPoorUser()
    {
        this.users = this.users.filter(user => user.money > 1_000_000);
        this.updateDom();
    }
}


let domArrayMethod = new DomArrayMethod(
    document.getElementById('main'),
    // @ts-ignore
    document.getElementById('add-user'),
    // @ts-ignore
    document.getElementById('double-money'),
    // @ts-ignore
    document.getElementById('show-millionaires'),
    // @ts-ignore
    document.getElementById('sort-by-richest'),
    // @ts-ignore
    document.getElementById('calculate-wealth'),
);
