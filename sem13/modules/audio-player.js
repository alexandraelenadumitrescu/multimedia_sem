export class AudioPlayer {
    #audioElement
    #playPauseButton
    #skipForwardButton
    #nextTrackButton
    #timeCurrentLabel
    #timeDurationLabel
    #playlistElement

    #tracks;
    /**
     * 
     * @param {HTMLAudioElement} audioElement 
     * @param {HTMLButtonElement} playPauseButton 
     * @param {HTMLButtonElement} skipForwardButton 
     * @param {HTMLButtonElement} nextTrackButton 
     * @param {HTMLElement} timeCurrentLabel 
     * @param {HTMLElement} timeDurationLabel 
     * @param {HTMLElement} playlistElement
     */
    constructor(audioElement, playPauseButton, skipForwardButton, nextTrackButton, timeCurrentLabel, timeDurationLabel, playlistElement) {
        this.#audioElement = audioElement;
        this.#playPauseButton = playPauseButton;
        this.#skipForwardButton = skipForwardButton;
        this.#nextTrackButton = nextTrackButton;
        this.#timeCurrentLabel = timeCurrentLabel;
        this.#timeDurationLabel = timeDurationLabel;
        this.#playlistElement = playlistElement;
        this.#bindControlEvents();
    }

    /**
     * load the given tracks into the audio player
     * @param {Array} tracks 
     */
    loadTracks(tracks) {
        this.#tracks = tracks;
        this.#playlistElement.innerHTML = '';
        const fragment =document.createDocumentFragment();
        tracks.forEach( track => {
            const li = document.createElement('li');
            li.textContent = track.title;
            li.classList.add('list-group-item');
            li.dataset.url = track.url;
            li.addEventListener('click', () => {
                this.#audioElement.src = track.url;
                this.#audioElement.play();
            });

            fragment.appendChild(li);
        });
        document.createDocumentFragment();
    }
    #bindControlEvents() {
        this.#playPauseButton.addEventListener('click', () => {
            if(!this.#audioElement.src) {
                if(this.#tracks && this.#tracks.length > 0) {
                    this.#playByUrl(this.#tracks[0].url);
                }
            }
            if (this.#audioElement.paused) {this.#audioElement.play();
                
            }
            else {this.#audioElement.pause();
                
            }
            this.#playPauseButton.children[0].classList.toggle('bi-play-fill');
            this.#playPauseButton.children[0].classList.toggle('bi-pause-fill');
        });
    }
    #playByUrl(url) {
        this.#audioElement.src = url;
        this.#audioElement.play();
    }

}
