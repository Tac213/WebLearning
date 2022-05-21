// @ts-check

class NewYearCountdown {
    constructor() {
        this.currentYear = 0;
        this.newYearTime = undefined;
        this.yearElement = document.getElementById('year');
        this.loadingElement = document.getElementById('loading');
        this.countdownElement = document.getElementById('countdown');
        this.daysElement = document.getElementById('days');
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.updateCurrentYear();
        setTimeout(() => {
            this.loadingElement.remove();
            this.countdownElement.style.display = 'flex';
        }, 3000);
        setInterval(this.updateCountdown.bind(this), 1000);
    }

    updateCurrentYear() {
        this.currentYear = new Date().getFullYear();
        this.newYearTime = new Date(`Janurary 01 ${this.currentYear + 1} 00:00:00`);
        this.yearElement.innerText = String(this.currentYear + 1);
    }

    updateCountdown() {
        const currentTime = new Date();
        // @ts-ignore
        let diff = this.newYearTime - currentTime;
        if (diff < 0) {
            this.updateCurrentYear();
            // @ts-ignore
            diff = this.newYearTime - currentTime;
        }
        const d = Math.floor(diff / 1000 / 60 / 60 / 24);
        const h = Math.floor(diff / 1000 / 60 / 60) % 24;
        const m = Math.floor(diff / 1000 / 60) % 60;
        const s = Math.floor(diff / 1000) % 60;

        this.daysElement.innerText = String(d);
        this.hoursElement.innerText = String(h < 0 ? '0' + h : h);
        this.minutesElement.innerText = String(m < 0 ? '0' + m : m);
        this.secondsElement.innerText = String(s < 0 ? '0' + s : s);
    }
}

const newYearCountdown = new NewYearCountdown();
