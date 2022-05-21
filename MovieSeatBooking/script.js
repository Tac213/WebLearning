// @ts-check

import { Seat } from './seat.js';

class MovieSeatBooking {
    constructor() {
        this.container = document.getElementById('container');
        this.seats = [];
        const seatElements = document.querySelectorAll('.row .seat');
        // @ts-ignore
        seatElements.forEach((element) => this.seats.push(new Seat(element)));
        /** @type {HTMLSelectElement} */
        // @ts-ignore
        this.movieElement = document.getElementById('movie');
        this.ticketPrice = Number(this.movieElement.value);
        this.movieElement.addEventListener('change', this.onMovieChanged.bind(this));

        for (const seat of this.seats) {
            seat.element.addEventListener('click', () => this.onSeatClicked(seat));
        }

        this.countElement = document.getElementById('count');
        this.priceElement = document.getElementById('total');
    }

    onMovieChanged(event) {
        this.ticketPrice = Number(event.target.value);
        this.updateText();
    }

    /**
     *
     * @param {Seat} seat
     */
    onSeatClicked(seat) {
        seat.toggleSelected();
        this.updateText();
    }

    updateText() {
        const count = this.seats.reduce(
            (previousValue, currentSeat) => previousValue + (currentSeat.isSelected ? 1 : 0),
            0
        );
        this.countElement.innerText = String(count);
        this.priceElement.innerText = String(count * this.ticketPrice);
    }
}

const movieSeatBooking = new MovieSeatBooking();
