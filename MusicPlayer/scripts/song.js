// @ts-check

export class Song {
    constructor() {
        this.url = '';
        this.title = '';
        this.cover = '';
        this.artist = '';
    }

    static createWithData(dataObj) {
        const song = new Song();
        song.url = dataObj.url;
        song.title = dataObj.title;
        song.cover = dataObj.cover;
        song.artist = dataObj.artist;
        return song;
    }
}
