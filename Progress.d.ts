import { RefObject } from 'react';
type ProgressProps = {
    progress: number;
    fref?: RefObject<HTMLDivElement | null>;
    isDragging?: RefObject<boolean>;
    width?: number;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onDrag: (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void;
};
export declare const Progress: ({ progress, fref, isDragging, width, onClick, onDrag, }: ProgressProps) => import("react/jsx-runtime").JSX.Element;
export {};
