// @ts-check

import { data } from './song-data.js';
import { Song } from './song.js';

class MusicPlayer {
    constructor() {
        /** @type {HTMLAudioElement} */
        // @ts-ignore
        this.audioElement = document.getElementById('audio');
        this.musicContainer = document.getElementById('music-container');
        this.playButton = document.getElementById('play');
        this.progressContainer = document.getElementById('progress-container');
        this.progressElement = document.getElementById('progress');
        this.titleElement = document.getElementById('title');
        /** @type {HTMLImageElement} */
        // @ts-ignore
        this.coverElement = document.getElementById('cover');
        this.artistElement = document.getElementById('artist');
        document.getElementById('prev').addEventListener('click', this.prevSong.bind(this));
        document.getElementById('next').addEventListener('click', this.nextSong.bind(this));
        this.progressContainer.addEventListener('click', this.setProgress.bind(this));
        this.playButton.addEventListener('click', this.onPlayButtonClick.bind(this));
        this.audioElement.addEventListener('timeupdate', this.updateProgress.bind(this));
        this.audioElement.addEventListener('ended', this.nextSong.bind(this));
        this.songs = data.map((songData) => Song.createWithData(songData));
        this.songIndex = Math.floor(Math.random() * this.songs.length);
        this.loadCurrentSong();
    }

    loadCurrentSong() {
        const song = this.songs[this.songIndex];
        this.titleElement.innerText = song.title;
        this.artistElement.innerText = song.artist;
        this.coverElement.src = song.cover;
        this.audioElement.src = song.url;
    }

    playCurrentSong() {
        this.musicContainer.classList.add('play');
        this.playButton.querySelector('i.fas').classList.remove('fa-play');
        this.playButton.querySelector('i.fas').classList.add('fa-pause');

        this.audioElement.play();
    }

    pauseCurrentSong() {
        this.musicContainer.classList.remove('play');
        this.playButton.querySelector('i.fas').classList.remove('fa-play');
        this.playButton.querySelector('i.fas').classList.add('fa-pause');

        this.audioElement.pause();
    }

    prevSong() {
        this.songIndex--;
        if (this.songIndex < 0) {
            this.songIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
        this.playCurrentSong();
    }

    nextSong() {
        this.songIndex++;
        if (this.songIndex >= this.songs.length) {
            this.songIndex = 0;
        }
        this.loadCurrentSong();
        this.playCurrentSong();
    }

    onPlayButtonClick() {
        const isPlaying = this.musicContainer.classList.contains('play');
        if (isPlaying) {
            this.pauseCurrentSong();
        } else {
            this.playCurrentSong();
        }
    }

    updateProgress() {
        const percent = (this.audioElement.currentTime / this.audioElement.duration) * 100;
        this.progressElement.style.width = `${percent}%`;
    }

    /**
     *
     * @param {PointerEvent} event
     */
    setProgress(event) {
        const clickX = event.offsetX;
        this.audioElement.currentTime = (clickX / this.progressContainer.clientWidth) * this.audioElement.duration;
    }
}

const musicPlayer = new MusicPlayer();
