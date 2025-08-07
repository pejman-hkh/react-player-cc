import { useEffect, useRef, type RefObject } from "react";

type ProgressProps = {
  progress: number,
  fref?: RefObject<HTMLDivElement | null>,
  isDragging?: RefObject<boolean>,
  width?: number
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void,
  onDrag: (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void,
};

export const Progress = ({
  progress,
  fref,
  isDragging,
  width,
  onClick,
  onDrag,
}: ProgressProps) => {

  const dragging = useRef(false);
  if (!isDragging) {
    isDragging = dragging;
  }

  useEffect(() => {
    const mouseupHandler = () => {
      isDragging.current = false;
    }
    document.addEventListener('mouseup', mouseupHandler);
    return () => document.removeEventListener('mouseup', mouseupHandler)
  }, [isDragging]);

  return <div
    style={width ? { width } : {}}
    className="player-progress-container"
    ref={fref}
    onClick={onClick}
    onMouseDown={() => isDragging.current = true}
    onMouseUp={() => isDragging.current = false}
    onMouseMove={(e) => isDragging?.current && onDrag(e)}
    onTouchStart={() => isDragging.current = true}
    onTouchEnd={() => isDragging.current = false}
    onTouchMove={(e) => isDragging?.current && onDrag(e)}
  >
    <div
      className="player-progress-bar"
      style={{
        width: `${progress}%`
      }}
    />
    <div className="player-container-bullet"
      style={{
        left: `calc(${progress}%)`
      }}
    />
  </div>
}
