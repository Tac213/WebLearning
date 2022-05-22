// @ts-check

export class DraggableItemElement extends HTMLDivElement {
    constructor() {
        super();

        // this.setAttribute('draggable', 'true');
        this.draggable = true;
        this.classList.add('draggable');
        this.personNameElement = document.createElement('p');
        this.personNameElement.classList.add('person-name');
        this.appendChild(this.personNameElement);
        this.dragButton = document.createElement('i');
        this.dragButton.classList.add('fas');
        this.dragButton.classList.add('fa-grip-lines');
        this.appendChild(this.dragButton);
        this.personName = '';
    }

    /**
     * @param {string} personName
     */
    setPersonName(personName) {
        this.personNameElement.innerText = personName;
        this.personName = personName;
    }
}

window.customElements.define('draggable-item', DraggableItemElement, { extends: 'div' });
