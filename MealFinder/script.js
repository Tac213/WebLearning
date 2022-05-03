// @ts-check

class MealFinder {
    /**
     *
     * @param {HTMLElement} resultHeadingElement
     * @param {HTMLElement} mealsElement
     * @param {HTMLElement} singleMealElement
     * @param {HTMLElement} notificationContainer
     */
    constructor(resultHeadingElement, mealsElement, singleMealElement, notificationContainer) {
        this.resultHeadingElement = resultHeadingElement;
        this.mealsElement = mealsElement;
        this.singleMealElement = singleMealElement;
        this.notificationContainer = notificationContainer;

        this.apiURL = 'https://www.themealdb.com/api/json/v1/1';

        this.mealsElement.addEventListener('click', this.onClickMeal.bind(this));
    }

    /**
     * search for meals
     * @param {SubmitEvent} event
     */
    async searchMeal(event) {
        event.preventDefault();
        /** @type {HTMLFormElement} */
        // @ts-ignore
        const form = event.target;
        /** @type {HTMLInputElement} */
        // @ts-ignore
        const inputElement = form.querySelector('input');
        const term = inputElement.value.trim();
        if (!term) {
            this.showNotification('Please type in a search term');
            await new Promise((resolve) => setTimeout(resolve, 2000));
            this.unshowNotification();
            return;
        }
        this.showNotification(`Searching: ${term}`);
        const res = await fetch(`${this.apiURL}/search.php?s=${term}`);
        const mealsData = await res.json();
        this.unshowNotification();
        if (!mealsData.meals) {
            this.resultHeadingElement.innerHTML = `<p>There are no search results for ${term}. Please try again.</p>`;
            this.mealsElement.innerHTML = '';
            this.singleMealElement.innerHTML = '';
            return;
        }
        this.resultHeadingElement.innerHTML = `<h2>Search result for: ${term}</h2>`;
        let mealHtmls = [];
        for (const mealData of mealsData.meals) {
            mealHtmls.push(`<div class="meal">
                <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" />
                <div class="meal-info" data-mealid="${mealData.idMeal}">
                    <h3>${mealData.strMeal}</h3>
                </div>
            </div>`);
        }
        this.mealsElement.innerHTML = mealHtmls.join('');
    }

    /**
     * random meals
     */
    async randomMeals() {
        this.resultHeadingElement.innerHTML = '';
        this.mealsElement.innerHTML = '';
        this.showNotification('Random a meal...');
        const res = await fetch(`${this.apiURL}/random.php`);
        const mealsData = await res.json();
        this.unshowNotification();
        const mealData = mealsData.meals[0];
        this.showMeal(mealData);
    }

    /**
     * @param {string} mealId
     */
    async lookupMealById(mealId) {
        this.showNotification('lookup a meal...');
        const res = await fetch(`${this.apiURL}/lookup.php?i=${mealId}`);
        const mealsData = await res.json();
        this.unshowNotification();
        return mealsData.meals[0];
    }

    showMeal(mealData) {
        let ingredientHtmls = [];
        let i = 1;
        while (mealData[`strIngredient${i}`]) {
            ingredientHtmls.push(`<li>${mealData[`strIngredient${i}`]} - ${mealData[`strMeasure${i}`]}</li>`);
            i++;
        }
        this.singleMealElement.innerHTML = `<div class="single-meal">
            <h1>${mealData.strMeal}</h1>
            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" />
            <div class="single-meal-info">
                ${mealData.strCategory ? `<p>${mealData.strCategory}</p>` : ''}
                ${mealData.strArea ? `<p>${mealData.strArea}</p>` : ''}
            </div>
            <div class="main">
                <p>${mealData.strInstructions}</p>
                ${
                    ingredientHtmls.length > 0
                        ? `
                        <h2>Ingredients</h2>
                        <ul>${ingredientHtmls.join('')}</ul>
                        `
                        : ''
                }
            </div>
        </div>`;
    }

    /**
     * @param {PointerEvent} event
     */
    async onClickMeal(event) {
        /** @type {HTMLElement} */
        // @ts-ignore
        const mealInfo = event.composedPath().find((item) => {
            // @ts-ignore
            if (item.classList) return item.classList.contains('meal-info');
            return false;
        });
        if (!mealInfo) return;
        const mealId = mealInfo.getAttribute('data-mealid');
        const mealData = await this.lookupMealById(mealId);
        this.showMeal(mealData);
    }

    /**
     * @param {string} message
     */
    showNotification(message) {
        const paragraphElement = this.notificationContainer.querySelector('p');
        paragraphElement.innerText = message;
        this.notificationContainer.classList.add('show');
    }

    unshowNotification() {
        this.notificationContainer.classList.remove('show');
    }
}

const mealFinder = new MealFinder(
    document.getElementById('result-heading'),
    document.getElementById('meals'),
    document.getElementById('single-meal'),
    document.getElementById('notification-container')
);

const searchForm = document.getElementById('search-form'),
    randomButton = document.getElementById('random');

searchForm.addEventListener('submit', mealFinder.searchMeal.bind(mealFinder));
randomButton.addEventListener('click', mealFinder.randomMeals.bind(mealFinder));
