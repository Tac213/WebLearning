// @ts-check

class SeatClassTag {
    static SEAT = 'seat';
    static SELECTED = 'selected';
    static OCCUPIED = 'occupied';
}

export class Seat {
    /**
     *
     * @param {HTMLDivElement} seatElement
     */
    constructor(seatElement) {
        if (!seatElement.classList.contains(SeatClassTag.SEAT)) {
            throw new TypeError('element should be seat');
        }
        this.element = seatElement;
        this.isSelected = false;
        this.isOccupied = false;
        if (seatElement.classList.contains(SeatClassTag.OCCUPIED)) {
            this.isOccupied = true;
        }
    }

    setOccupied(isOccupied = true) {
        this.isOccupied = isOccupied;
        if (isOccupied) {
            this.element.classList.add(SeatClassTag.OCCUPIED);
        } else {
            this.element.classList.remove(SeatClassTag.OCCUPIED);
        }
    }

    toggleSelected() {
        if (this.isOccupied) {
            return;
        }
        this.isSelected = !this.isSelected;
        if (this.isSelected) {
            this.element.classList.add(SeatClassTag.SELECTED);
        } else {
            this.element.classList.remove(SeatClassTag.SELECTED);
        }
    }
}
