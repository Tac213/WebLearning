// @ts-check

import { DragDropLIElement } from './drag-drop-li.js';
import { DraggableItemElement } from './draggable-item.js';

const richestPeople = [
    'Jeff Bezos',
    'Bill Gates',
    'Warren Buffett',
    'Bernard Arnault',
    'Carlos Slim Helu',
    'Amancio Ortega',
    'Larry Ellison',
    'Mark Zuckerberg',
    'Michael Bloomberg',
    'Larry Page',
];

class DragDropView {
    constructor() {
        this.dragDropList = document.getElementById('draggable-list');
        document.getElementById('check').addEventListener('click', this.onCheckOrder.bind(this));
        this.richestPeople = [];
        this.dragStartIndex = -1;
        this.initialize();
    }

    initialize() {
        this._initializeRichestPeople();
        this.richestPeople.forEach((personName, index) => {
            /** @type {DragDropLIElement} */
            // @ts-ignore
            const dragDropLi = document.createElement('li', { is: 'drag-drop-li' });
            dragDropLi.addEventListener('drop', () => this.onDrop(dragDropLi));
            /** @type {DraggableItemElement} */
            // @ts-ignore
            const draggableItem = document.createElement('div', { is: 'draggable-item' });
            draggableItem.addEventListener('dragstart', () => this.onDragStart(draggableItem));
            dragDropLi.initialize(index, draggableItem);
            this.dragDropList.appendChild(dragDropLi);
            draggableItem.setPersonName(personName);
        });
    }

    _initializeRichestPeople() {
        this.richestPeople = richestPeople
            .map((personName) => ({ name: personName, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map((person) => person.name);
    }

    onCheckOrder() {
        this.dragDropList.childNodes.forEach((element, index) => {
            // @ts-ignore
            if (element.draggableItem.personName === richestPeople[index]) {
                // @ts-ignore
                element.classList.remove('wrong');
                // @ts-ignore
                element.classList.add('right');
            } else {
                // @ts-ignore
                element.classList.remove('right');
                // @ts-ignore
                element.classList.add('wrong');
            }
        });
    }

    /**
     * @param {DraggableItemElement} draggableItem
     */
    onDragStart(draggableItem) {
        // @ts-ignore
        this.dragStartIndex = draggableItem.closest('li').index;
    }

    /**
     *
     * @param {DragDropLIElement} dragDropLi
     */
    onDrop(dragDropLi) {
        /** @type {DragDropLIElement} */
        // @ts-ignore
        const fromDragDropLi = this.dragDropList.childNodes[this.dragStartIndex];
        const fromItem = fromDragDropLi.draggableItem;
        const toItem = dragDropLi.draggableItem;
        fromDragDropLi.appendChild(toItem);
        fromDragDropLi.draggableItem = toItem;
        dragDropLi.appendChild(fromItem);
        dragDropLi.draggableItem = fromItem;
    }
}

const dragDropView = new DragDropView();
