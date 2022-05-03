// @ts-check

class EOptionType {
    static SEARCH = 0;
    static PAGE = 1;
}

class LastOption {
    constructor() {
        this.optionType = EOptionType.SEARCH;
        this.optionArg = '';
    }
}

class LyricsSearch {
    /**
     * @param {HTMLFormElement} searchForm
     * @param {HTMLInputElement} searchInput
     * @param {HTMLElement} resultContainer
     * @param {HTMLElement} moreContainer
     * @param {HTMLElement} notificationContainer
     */
    constructor(searchForm, searchInput, resultContainer, moreContainer, notificationContainer) {
        this.searchInput = searchInput;
        this.resultContainer = resultContainer;
        this.moreContainer = moreContainer;
        this.notificationContainer = notificationContainer;

        this.apiURL = 'https://api.lyrics.ovh';
        this.notificationTimeout = null;
        this.lastOption = new LastOption();

        searchForm.addEventListener('submit', this.onSearch.bind(this));
        this.resultContainer.addEventListener('click', this.onClickResult.bind(this));
    }

    /**
     *
     * @param {SubmitEvent} event
     */
    async onSearch(event) {
        const searchText = this.searchInput.value;
        if (!searchText) {
            this.notify('Please type in a search term');
            return;
        }
        this.showNotification('Searching...');
        const songDatas = await this.searchSongs(searchText);
        this.showData(songDatas);
        this.unshowNotification();
    }

    /**
     * @param {PointerEvent} event
     */
    async onClickResult(event) {
        /** @type {HTMLElement} */
        // @ts-ignore
        const eventTarget = event.target;
        if (eventTarget.tagName !== 'BUTTON') {
            return;
        }
        const artistName = eventTarget.getAttribute('data-artist');
        const songTitle = eventTarget.getAttribute('data-songtitle');
        this.showNotification('Fetching lyrics data...');
        const lyricsData = await this.getLyrics(artistName, songTitle);
        this.showLyrics(lyricsData, artistName, songTitle);
        this.unshowNotification();
    }

    /**
     * @param {string} term
     * @returns {Promise<{data: Array, prev: string, next: string}>}
     */
    async searchSongs(term) {
        if (!term) {
            return;
        }
        this.lastOption.optionType = EOptionType.SEARCH;
        this.lastOption.optionArg = term;
        const res = await fetch(`${this.apiURL}/suggest/${term}`);
        const songDatas = res.json();
        return songDatas;
    }

    /**
     *
     * @param {string} url
     */
    async getMoreSongs(url) {
        if (!url) {
            return;
        }
        this.lastOption.optionType = EOptionType.PAGE;
        this.lastOption.optionArg = url;
        const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
        });
        const songDatas = res.json();
        return songDatas;
    }

    /**
     * @param {string} artistName
     * @param {string} songTitle
     */
    async getLyrics(artistName, songTitle) {
        const res = await fetch(`${this.apiURL}/v1/${artistName}/${songTitle}`);
        const data = res.json();
        return data;
    }

    /**
     * @param {string} url
     * @param {string} text Button text
     * @returns {HTMLButtonElement}
     */
    createMoreSongsButton(url, text) {
        if (!url) {
            return null;
        }
        async function onClick() {
            this.showNotification(`Searching ${text.toLowerCase()} page...`);
            const songDatas = await this.getMoreSongs(url);
            this.showData(songDatas);
            this.unshowNotification();
        }
        /** @type {HTMLButtonElement} */
        const button = document.createElement('button');
        button.classList.add('btn');
        button.innerText = text;
        button.addEventListener('click', onClick.bind(this));
        return button;
    }

    /**
     * @returns {HTMLButtonElement}
     */
    createBackButon() {
        async function onClick() {
            this.showNotification('Going back...');
            let songDatas;
            if (this.lastOption.optionType === EOptionType.SEARCH) {
                songDatas = await this.searchSongs(this.lastOption.optionArg);
                this.showData(songDatas);
            } else if (this.lastOption.optionType === EOptionType.PAGE) {
                songDatas = await this.getMoreSongs(this.lastOption.optionArg);
                this.showData(songDatas);
            }
            if (!songDatas) {
                this.showNotification("Something goes wrong, we can't go back, please refresh the website");
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }
            this.unshowNotification();
        }
        /** @type {HTMLButtonElement} */
        const button = document.createElement('button');
        button.classList.add('btn');
        button.innerText = 'Back';
        button.addEventListener('click', onClick.bind(this));
        return button;
    }

    /**
     * @param {{data: Array, prev: string, next: string}} songDatas
     */
    showData(songDatas) {
        let songHtmls = [];
        for (const songData of songDatas.data) {
            songHtmls.push(`<li>
            <span><strong>${songData.artist.name}</strong> - ${songData.title}</span>
            <button class="btn" data-artist="${songData.artist.name}" data-songtitle="${songData.title}">Get Lyrics</button>
            </li>`);
        }
        this.resultContainer.innerHTML = `<ul class="songs">${songHtmls.join('')}</ul>`;

        this.moreContainer.innerHTML = '';
        if (songDatas.prev) {
            const button = this.createMoreSongsButton(songDatas.prev, 'Prev');
            this.moreContainer.appendChild(button);
        }
        if (songDatas.next) {
            const button = this.createMoreSongsButton(songDatas.next, 'Next');
            this.moreContainer.appendChild(button);
        }
    }

    /**
     *
     * @param {{lyrics: string, error: string}} lyricsData
     * @param {string} artistName
     * @param {string} songTitle
     */
    showLyrics(lyricsData, artistName, songTitle) {
        if (lyricsData.error) {
            this.resultContainer.innerHTML = lyricsData.error;
        } else {
            const lyricsHtml = lyricsData.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
            this.resultContainer.innerHTML = `
                <h2><strong>${artistName}</strong> - ${songTitle}<h2>
                <span>${lyricsHtml}</span>
            `;
        }
        this.moreContainer.innerHTML = '';
        const button = this.createBackButon();
        this.moreContainer.appendChild(button);
    }

    /**
     * @param {string} message
     */
    notify(message) {
        this.showNotification(message);
        this.notificationTimeout = setTimeout(() => {
            this.notificationTimeout = null;
            this.unshowNotification();
        }, 2000);
    }

    /**
     * @param {string} message
     */
    showNotification(message) {
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
        }
        const paragraphElement = this.notificationContainer.querySelector('p');
        paragraphElement.innerText = message;
        this.notificationContainer.classList.add('show');
    }

    unshowNotification() {
        this.notificationContainer.classList.remove('show');
    }
}

let lyricsSearch = new LyricsSearch(
    // @ts-ignore
    document.getElementById('search-form'),
    document.getElementById('search-input'),
    document.getElementById('result-container'),
    document.getElementById('more-container'),
    document.getElementById('notification-container')
);
