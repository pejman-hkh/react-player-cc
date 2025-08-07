import 'react';
declare global {
    interface HTMLVideoElement {
        type?: string;
    }
}

declare module 'react' {
    interface VideoHTMLAttributes<T> extends HTMLAttributes<T> {
        type?: string;
    }
}