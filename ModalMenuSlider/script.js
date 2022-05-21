// @ts-check

const modalDialog = document.getElementById('modal');
document.getElementById('open').addEventListener('click', () => modalDialog.classList.add('show-modal'));
document.getElementById('close').addEventListener('click', () => modalDialog.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target == modalDialog ? modalDialog.classList.remove('show-modal') : false));

const navBar = document.getElementById('navbar');
const toggleButton = document.getElementById('toggle');

/**
 * close nav bar
 * @param {MouseEvent} event
 * @returns {void}
 */
function closeNavBar(event) {
    if (
        document.body.classList.contains('show-nav') &&
        event.target !== toggleButton &&
        // @ts-ignore
        !toggleButton.contains(event.target) &&
        event.target !== navBar &&
        // @ts-ignore
        !navBar.contains(event.target)
    ) {
        document.body.classList.toggle('show-nav');
        document.body.removeEventListener('click', closeNavBar);
    } else if (!document.body.classList.contains('show-nav')) {
        document.body.removeEventListener('click', closeNavBar);
    }
}

toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('show-nav');
    document.body.addEventListener('click', closeNavBar);
});
