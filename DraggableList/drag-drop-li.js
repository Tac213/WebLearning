// @ts-check

import { DraggableItemElement } from './draggable-item.js';

export class DragDropLIElement extends HTMLLIElement {
    constructor() {
        super();

        this.index = -1;
        this.draggableItem = null;
        this.indexElement = null;
    }

    /**
     * @param {number} index
     * @param {DraggableItemElement} draggableItem
     */
    initialize(index, draggableItem) {
        this.index = index;
        this.draggableItem = draggableItem;
        this.indexElement = document.createElement('span');
        this.indexElement.classList.add('number');
        this.indexElement.innerText = `${index + 1}`;
        this.appendChild(this.indexElement);
        this.appendChild(this.draggableItem);
        this.addEventListener('dragover', this.onDragOver.bind(this));
        this.addEventListener('dragenter', this.onDragEnter.bind(this));
        this.addEventListener('dragleave', this.onDragLeave.bind(this));
        this.addEventListener('drop', this.onDragLeave.bind(this));
    }

    /**
     * @param {DragEvent} event
     */
    onDragOver(event) {
        event.preventDefault();
    }

    /**
     * @param {DragEvent} event
     */
    onDragEnter(event) {
        this.classList.add('over');
    }

    /**
     * @param {DragEvent} event
     */
    onDragLeave(event) {
        this.classList.remove('over');
    }
}

window.customElements.define('drag-drop-li', DragDropLIElement, { extends: 'li' });
