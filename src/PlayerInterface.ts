export interface PlayerInterface {
    load(src: string): void;
    play(): void;
    pause(): void;
    destroy(): void;
}