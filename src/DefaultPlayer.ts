import type { PlayerInterface } from "./PlayerInterface";

export class DefaultPlayer implements PlayerInterface {
    private video: HTMLVideoElement;

    constructor(video: HTMLVideoElement) {
        this.video = video;
    }

    load(src: string) {
        this.video.src = src;
    }

    play() {
        this.video.play();
    }

    pause() {
        this.video.pause();
    }

    destroy() {
        this.video.src = "";
    }
}