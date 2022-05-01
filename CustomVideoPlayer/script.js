// @ts-check

class VideoPlayer {
    /**
     *
     * @param {HTMLVideoElement} inVideo
     * @param {HTMLButtonElement} inPlayButton
     * @param {HTMLButtonElement} inStopButton
     * @param {HTMLProgressElement} inProgress
     * @param {HTMLSpanElement} inTimestamp
     */
    constructor(inVideo, inPlayButton, inStopButton, inProgress, inTimestamp) {
        this.video = inVideo;
        this.playButton = inPlayButton;
        this.stopButton = inStopButton;
        this.progress = inProgress;
        this.timestamp = inTimestamp;

        this.video.addEventListener('click', this.toggleVideoStatus.bind(this));
        this.video.addEventListener('timeupdate', this.updateProgress.bind(this));
        this.video.addEventListener('play', this.togglePlayIcon.bind(this));
        this.video.addEventListener('pause', this.togglePlayIcon.bind(this));

        this.playButton.addEventListener('click', this.toggleVideoStatus.bind(this));

        this.stopButton.addEventListener('click', this.stopVideo.bind(this));

        this.progress.addEventListener('change', this.setVideoProgress.bind(this));

        this.isStopped = true;
    }

    /**
     * toggle video status
     * @param {PointerEvent} event
     * @returns {void}
     */
    toggleVideoStatus(event) {
        this.isStopped = false;
        if (this.video.paused) {
            this.video.play();
        } else {
            this.video.pause();
        }
    }

    /**
     * stop video
     * @param {PointerEvent} event
     * @returns {void}
     */
    stopVideo(event) {
        this.video.currentTime = 0;
        this.video.pause();
        this.isStopped = true;
    }

    /**
     * toggle play icon
     * @param {Event} event
     * @returns {void}
     */
    togglePlayIcon(event) {
        if (this.video.paused) {
            this.playButton.innerHTML = '<i class="fa fa-play fa-2x"></i>';
        } else {
            this.playButton.innerHTML = '<i class="fa fa-pause fa-2x"></i>';
        }
    }

    /**
     * update progress
     * @param {Event} event
     * @returns {void}
     */
    updateProgress(event) {
        this.progress.value = (this.video.currentTime / this.video.duration) * 100;

        this.timestamp.innerHTML = this.formatTime(this.video.currentTime);
    }

    /**
     * format time
     * @param {number} time
     * @returns {string}
     */
    formatTime(time) {
        let hours = Math.floor(time / 3600);
        let minutes = Math.floor((time % 3600) / 60);
        let seconds = Math.floor(time % 60);

        let ret = '';
        if (hours > 0) {
            ret += '' + hours + ':';
        }
        if (minutes < 10) {
            ret += '0';
        }
        ret += '' + minutes + ':';
        if (seconds < 10) {
            ret += '0';
        }
        ret += '' + seconds;
        return ret;
    }

    /**
     * setVideoProgress
     * @param {Event} event
     */
    setVideoProgress(event) {
        if (this.isStopped) {
            this.progress.value = 0;
            return;
        }
        this.video.currentTime = (this.progress.value * this.video.duration) / 100;
    }
}

const videoPlayer = new VideoPlayer(
    // @ts-ignore
    document.getElementById('video'),
    // @ts-ignore
    document.getElementById('play'),
    // @ts-ignore
    document.getElementById('stop'),
    // @ts-ignore
    document.getElementById('progress'),
    // @ts-ignore
    document.getElementById('timestamp')
);
