import { ReactNode, RefObject } from 'react';
import { LangCode } from './lang';
export type SubtitleType = {
    id: number;
    title: string;
    link: string;
    default?: boolean;
};
type PlayerProps = {
    alert?: ReactNode;
    children?: ReactNode;
    id?: number;
    src?: string;
    subtitles?: SubtitleType[];
    lang?: LangCode;
    onPlay?: (video: RefObject<HTMLVideoElement | null>, isFullScreen: boolean) => void;
    onPause?: (video: RefObject<HTMLVideoElement | null>, isFullScreen: boolean) => void;
    onLoad?: (selectSubtitle: (subtitle: SubtitleType) => Promise<string | undefined>) => void;
    onFullScreen?: (isFullScreen: boolean) => void;
};
export default function ReactPlayerCC({ alert, children, id, src, subtitles, lang, onPlay, onPause, onLoad, onFullScreen }: PlayerProps): import("react/jsx-runtime").JSX.Element;
export {};
