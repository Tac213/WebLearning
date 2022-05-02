// @ts-check

class InfiniteScrollBlog {
    /**
     * @param {HTMLElement} postContainer
     * @param {HTMLElement} loader
     * @param {HTMLInputElement} filter
     */
    constructor(postContainer, loader, filter) {
        this.postContainer = postContainer;
        this.loader = loader;
        this.filter = filter;
        this.postCount = 0;
        this.currentPage = 1;
        this.isFiltering = false;

        window.addEventListener('scroll', this.onScroll.bind(this));
        this.filter.addEventListener('input', this.onFilter.bind(this));

        this.initialize();
    }

    async initialize() {
        const posts = await this.getPosts(20);
        this.showPosts(posts);
    }

    async showMorePosts() {
        this.currentPage++;
        this.loader.classList.add('show');
        const posts = await this.getPosts();
        this.loader.classList.remove('show');
        this.showPosts(posts);
    }

    async getPosts(limit = 5) {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${this.currentPage}`);
        const posts = await res.json();
        return posts;
    }

    /**
     * show posts to dom
     * @param {Array<{title: string, body: string}>} posts
     */
    showPosts(posts) {
        for (const post of posts) {
            this.postCount++;
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <div class="number">${this.postCount}</div>
                <div class="post-info">
                    <h2 class="post-title">${post.title}</h2>
                    <p class="post-body">${post.body}</p>
                </div>
            `;
            this.postContainer.appendChild(postElement);
        }
    }

    /**
     * @param {Event} event
     */
    onScroll(event) {
        if (this.isFiltering) {
            return;
        }
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollHeight - scrollTop === clientHeight) {
            this.showMorePosts();
        }
    }

    /**
     * @param {InputEvent} event
     */
    onFilter(event) {
        const term = this.filter.value.toUpperCase();
        this.isFiltering = term.length > 0;
        const postElements = this.postContainer.querySelectorAll('.post');
        for (const postElement of postElements) {
            // @ts-ignore
            const title = postElement.querySelector('.post-title').innerText.toUpperCase();
            // @ts-ignore
            const body = postElement.querySelector('.post-body').innerText.toUpperCase();
            if (title.indexOf(term) > -1 || body.indexOf(term) > -1) {
                // @ts-ignore
                postElement.style.display = 'flex';
            } else {
                // @ts-ignore
                postElement.style.display = 'none';
            }
        }
    }
}

const infiniteScrollBlog = new InfiniteScrollBlog(
    document.getElementById('post-container'),
    document.querySelector('.loader'),
    // @ts-ignore
    document.getElementById('filter')
);
