"use client"
import React, { type MouseEvent, type ReactNode, type RefObject, useCallback, useEffect, useRef, useState } from 'react';
import './ReactPlayerCC.css';
import Spinner from './Spinner';
import { formatTime, makeBlobUrl } from './utils';
import { Progress } from './Progress';
import { useTranslator, type LangCode } from './lang';
import icons from './icons';
import type { PlayerInterface } from './PlayerInterface';
import { DefaultPlayer } from './DefaultPlayer';
export type SubtitleType = {
  id: number;
  title: string;
  link: string;
  default?: boolean;
};

type ButtonProps = {
  subtitle: SubtitleType,
  activeSubtitle: number,
  lang: LangCode,
  selectSubtitle: (subtitle: SubtitleType) => void,
};

const SubtitleButton = ({
  subtitle,
  activeSubtitle,
  lang,
  selectSubtitle,
}: ButtonProps) => {
  const [color, setColor] = useState("");
  const t = useTranslator(lang);

  return <li>
    <button aria-label={t('Subtitle')} className={activeSubtitle === subtitle?.id ? `text-primary` : `text-${color}`} onClick={async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      selectSubtitle(subtitle);
      setColor('success');
    }}>{subtitle?.title}</button>
  </li>;
}

type PlayerProps = {
  alert?: ReactNode,
  children?: ReactNode,
  id?: number,
  src: string,
  subtitles?: SubtitleType[],
  lang?: LangCode,
  onPlay?: (video: RefObject<HTMLVideoElement | null>, isFullScreen: boolean) => void,
  onPause?: (video: RefObject<HTMLVideoElement | null>, isFullScreen: boolean) => void,
  onLoad?: (selectSubtitle: (subtitle: SubtitleType) => Promise<string | undefined>) => void,
  onFullScreen?: (isFullScreen: boolean) => void,
  playerClass?: new (video: HTMLVideoElement) => PlayerInterface;
};

export default function ReactPlayerCC({
  alert,
  children,
  id,
  src,
  subtitles,
  lang = "en",
  playerClass = DefaultPlayer,
  onPlay,
  onPause,
  onLoad,
  onFullScreen
}: PlayerProps) {

  const t = useTranslator(lang);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerBarRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLTrackElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeProgressRef = useRef<HTMLDivElement>(null);
  const lastSaved = useRef<number>(0);
  const hideControlsTimeout = useRef<ReturnType<typeof setTimeout>>(null);
  const [activeCue, setActiveCue] = useState('');
  const [activeSubtitle, setActiveSubtitle] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [subtitleOffset, setSubtitleOffset] = useState(0);
  const [play, setPlay] = useState(false);
  const isHovered = useRef(false);

  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fromFirst, setFromFirst] = useState(false);
  const clickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDragging = useRef(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [barVisibility, setBarVisibility] = useState(true);
  let subtitleMarginDefault = 20;
  if (typeof localStorage !== 'undefined') {
    if (localStorage.getItem("subtitleMargin")) {
      subtitleMarginDefault = parseInt(localStorage?.getItem("subtitleMargin") || "0");
    }
  }
  const [subtitleMargin, setSubtitleMargin] = useState(subtitleMarginDefault);
  const [direction, setDirection] = useState<string>("ltr");
  const isPlaying = useRef(false);

  const [showSubtitles, setShowSubtitles] = useState(false);

  const playerRef = useRef<PlayerInterface>(null);

  useEffect(() => {
    if (videoRef.current) {
      playerRef.current = new playerClass(videoRef.current);
      playerRef.current.load(src);
    }
    return () => playerRef.current?.destroy();
  }, [playerClass, src]);


  const loadSubtitle = () => {
    const video = videoRef.current!;
    const track = video?.textTracks[0];
    if (track) {

      track.mode = 'hidden';

      track.oncuechange = () => {

        const cue = track.activeCues?.[0];
        if (cue) {
          setActiveCue(cue ? (cue as unknown as { text: string })?.text : '');
        } else {
          setActiveCue('');
        }
      };
    }
  }

  useEffect(() => {
    const video = videoRef.current!;

    loadSubtitle();

    const render = () => {
      if (!isPlaying.current) return;

      video.requestVideoFrameCallback(() => {

        if (!isDragging?.current) {
          setProgress((video.currentTime / video.duration) * 100);
          setCurrentTime(video.currentTime);
          setDuration(video.duration);
        }

        render();
      });
    };

    video.addEventListener('loadedmetadata', () => {
      setDuration(video.duration);
    });

    video.addEventListener('play', () => {
      isPlaying.current = true;
      render();
    });

    video.addEventListener('pause', () => {
      isPlaying.current = false;
    });

    video.addEventListener('ended', () => {
      isPlaying.current = false;
    });

    video.addEventListener('timeupdate', () => {
      if (Math.abs(video.currentTime - lastSaved.current) >= 5) {
        localStorage.setItem(`video-progress-${id}`, String(video.currentTime));
        lastSaved.current = video.currentTime;
      }
    });

    video.addEventListener('ended', () => {
      localStorage.removeItem(`video-progress-${id}`);
    });

    video.addEventListener('loadedmetadata', () => {
      const key = `video-progress-${id}`;
      const savedTime = parseFloat(localStorage.getItem(key) || '0');

      if (!isNaN(savedTime) && savedTime < video.duration - 10 && savedTime > 0) {
        setFromFirst(true);
        video.currentTime = savedTime;

        setProgress((video.currentTime / video.duration) * 100);
        setCurrentTime(video.currentTime);
        setDuration(video.duration);
      }
    });

    const showLoader = () => setLoading(true);
    const hideLoader = () => setLoading(false);

    video.addEventListener('waiting', showLoader);
    video.addEventListener('seeking', showLoader);
    video.addEventListener('canplay', hideLoader);
    video.addEventListener('playing', hideLoader);
    video.addEventListener('ended', hideLoader);

    return () => {
      video.removeEventListener('waiting', showLoader);
      video.removeEventListener('seeking', showLoader);
      video.removeEventListener('canplay', hideLoader);
      video.removeEventListener('playing', hideLoader);
      video.removeEventListener('ended', hideLoader);
    };

  }, [activeCue, id, isDragging, isFullScreen]);

  const setProgressPlacement = (clientX: number) => {
    const progressBar = progressRef.current!;
    const rect = progressBar.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const ratio = clickX / rect.width;
    setProgress(ratio * 100);
    return ratio;
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const ratio = setProgressPlacement(e.clientX);
    const video = videoRef.current!;
    try {
      video.currentTime = ratio * video.duration;
    } catch (e) {
      console.log(e);
    }
  };

  const handleDrag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {

    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    const ratio = setProgressPlacement(clientX);
    const video = videoRef.current!;
    try {
      video.currentTime = ratio * video.duration;
    } catch (e) {
      console.log(e);
    }
  };

  const enterFullscreen = () => {
    const container = containerRef.current!;

    const isFullScreen = document.fullscreenElement === container;

    if (isFullScreen) {
      if (onFullScreen) {
        onFullScreen(false);
      }
      setIsFullScreen(false);
      document.exitFullscreen();

    } else {
      if (onFullScreen) {
        onFullScreen(true);
      }
      setIsFullScreen(true);
      container.requestFullscreen();
    }
    videoRef?.current?.focus();
    isHovered.current = true;
  };


  const playHandler = () => {
    if (!videoRef?.current) {
      return;
    }

    const video = videoRef?.current;
    const hasSrc = video?.src !== "" && video?.src !== document.location.href;

    if (!play) {
      if (onPlay) {
        onPlay(videoRef, isFullScreen);
      }
      if (hasSrc) {
        playerRef.current?.play();
      }
    } else {
      if (onPause) {
        onPause(videoRef, isFullScreen);
      }
      if (hasSrc) {
        playerRef.current?.pause();
      }
    }
    if (hasSrc) {
      setPlay(!play);
    }

  }

  const [volume, setVolume] = useState(100);

  useEffect(() => {
    if (videoRef.current) {
      const cvolume = volume / 100
      videoRef.current.volume = cvolume > 1 ? 1 : cvolume;
    }
  }, [volume]);

  const getVolumeRatio = (clientX: number) => {
    const progressBar = volumeProgressRef.current!;
    const rect = progressBar.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const ratio = clickX / rect.width;
    return ratio;
  }

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    const ratio = getVolumeRatio(clientX);
    if (ratio > 1 || ratio < 0) {
      return;
    }

    setVolume(ratio * 100);

    if (videoRef.current) {
      videoRef.current.volume = ratio;
    }
  };

  const selectSubtitle = useCallback(async (subtitle: SubtitleType) => {
    if (!trackRef.current) return;
    setShowSubtitles(false);
    const api = await fetch(subtitle.link);
    const text = await api.text();

    if (trackRef.current) {
      trackRef.current.src = makeBlobUrl(text);
    }

    loadSubtitle();
    setActiveSubtitle(subtitle?.id);

    return text;
  }, []);

  useEffect(() => {
    if (onLoad) {
      onLoad(selectSubtitle);
    }

  }, [onLoad, selectSubtitle]);

  const hideBar = useCallback(() => {
    if (isFullScreen && containerRef?.current) {
      clearTimeout(hideControlsTimeout.current!);
      hideControlsTimeout.current = setTimeout(() => {
        setBarVisibility(false);
        document.body.style.cursor = 'none';
      }, 5000);
    }
  }, [isFullScreen])

  const updatePlayer = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
      setBarVisibility(true);
      hideBar();
    }
  }, [hideBar])

  const seekForward = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.min(video.currentTime + 10, video.duration);
      updatePlayer();
    }
  }, [updatePlayer])


  const seekBackward = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.max(video.currentTime - 10, 0);
      updatePlayer();
    }
  }, [updatePlayer]);

  useEffect(() => {

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isHovered?.current) return;

      if (e.key === 'ArrowLeft') {
        seekBackward();
      } else if (e.key === 'ArrowRight') {
        seekForward();
      }
    };

    if (fromFirst) {
      setTimeout(() => {
        setFromFirst(false);
      }, 10000);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fromFirst, isHovered, seekBackward, seekForward]);

  // useEffect(() => {

  //   const video = videoRef?.current;
  //   if (video) {
  //     video.src = src || "";
  //   }
  //   return () => {

  //     if (video) {
  //       video.pause();
  //       video.src = '';
  //       video.load();
  //     }
  //   };
  // }, [src]);

  const videoType = `video/x-matroska; codecs="theora, vorbis"`;

  useEffect(() => {
    return () => {
      clearTimeout(hideControlsTimeout.current!);
      document.body.style.cursor = 'default';
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullScreen = document.fullscreenElement;

      if (!isNowFullScreen) {
        if (onFullScreen) {
          onFullScreen(false);
        }
        setIsFullScreen(false);
      } else {
        if (onFullScreen) {
          onFullScreen(true);
        }
        setIsFullScreen(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);

    };
  }, [onFullScreen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isHovered?.current) {
        if (e.key === "Enter") {
          const video = videoRef.current;
          if (video) {
            if (!barVisibility) {
              setBarVisibility(true);
              hideBar();
            } else {
              if (video.paused) {
                playerRef.current?.play();
                setPlay(true);
              } else {
                playerRef.current?.pause();
                setPlay(false);
              }
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [barVisibility, hideBar]);

  useEffect(() => {
    const moveHandler = () => {
      document.body.style.cursor = 'default';
    }
    document.addEventListener('mousemove', moveHandler);
    return () => document.removeEventListener('mousemove', moveHandler);
  }, []);

  const addOffset = (offset = 0.5) => {
    const video = videoRef?.current
    if (video) {
      Array.from(video.textTracks).forEach((track) => {
        if (track.cues) {
          Array.from(track.cues).forEach((cue) => {
            setSubtitleOffset(subtitleOffset + offset);
            cue.startTime += offset;
            cue.endTime += offset;
          });
          return true;
        }
      });
    }
    return false;
  };

  const removeOffset = (offset = 0.5) => {
    const video = videoRef?.current
    if (video) {
      Array.from(video.textTracks).forEach((track) => {
        if (track.cues) {
          Array.from(track.cues).forEach((cue) => {
            setSubtitleOffset(subtitleOffset - offset);
            cue.startTime -= offset;
            cue.endTime -= offset;
          });
          return true;
        }
      });
    }
    return false;
  }

  useEffect(() => {
    subtitles?.map((subtitle) => {
      if (subtitle?.default) {
        selectSubtitle(subtitle);
      }
    });

  }, [selectSubtitle, subtitles]);

  return (
    <div ref={containerRef}
      onMouseMove={() => {
        if (!barVisibility) {
          setBarVisibility(true);
          document.body.style.cursor = 'default';
        }

        hideBar();
      }}
      className={"playercc-container" + (isFullScreen ? " playercc-fullscreen" : "")}
    >
      <video
        preload="none"
        type={videoType}
        tabIndex={0}
        autoFocus
        onClick={() => {
          if (clickTimeout.current) return;
          clickTimeout.current = setTimeout(() => {
            setShowSubtitles(false);
            if (!showSubtitles) {
              playHandler();
            }
            clickTimeout.current = null;
          }, 200);
        }}
        onDoubleClick={(e: React.MouseEvent<HTMLVideoElement>) => {
          if (clickTimeout.current) {
            clearTimeout(clickTimeout.current);
            clickTimeout.current = null;
          }

          const { clientX } = e;
          const { width, left } = e.currentTarget.getBoundingClientRect();
          const clickX = clientX - left;

          if (clickX < width / 2) {
            seekBackward();
          } else {
            seekForward();
          }
          playerRef.current?.play();
          setPlay(true);
        }}
        onMouseEnter={() => isHovered.current = true}
        onMouseLeave={() => isHovered.current = false}
        ref={videoRef}
        src={src}
        style={{ width: '100%', height: '100%' }}
      >
        <track
          ref={trackRef}
          label="Subtitle"
          kind="subtitles"
          srcLang="en"
          src="/subtitle.vtt"
          default
        />
      </video>


      {loading && <div className="playercc-title">
        <Spinner />
      </div>}

      {!loading && !play && <div className="playercc-title playercc-title-no-background" onClick={() => {
        setShowSubtitles(false);
        if (!showSubtitles) {
          playHandler();
        }
      }}>
        <div className="playercc-play-icon">
          <i>
            {icons.play}
          </i>
        </div>
        {alert}
      </div>}

      <div className={"playercc-bar-wrapper"} ref={playerBarRef}>
        {children}

        {activeCue !== "" && <div className="playercc-subtitle" style={{ marginBottom: subtitleMargin }} dir={direction} dangerouslySetInnerHTML={{ __html: activeCue }}></div>}

        <div className={"playercc-bars" + (!barVisibility ? " v-none" : "")}>


          <div className="playercc-bar">


            {fromFirst && <button aria-label={t('Play From First')} onClick={() => {
              const video = videoRef?.current;
              if (video) {
                video.currentTime = 0;
                setProgress((video.currentTime / video.duration) * 100);
                setCurrentTime(video.currentTime);
                setDuration(video.duration);
                const key = `video-progress-${id}`;
                localStorage.removeItem(key);
                setFromFirst(false);
                playerRef.current?.play();
              }
            }} className="playercc-fromfirst">
              <h5>{t('Play from First')}</h5>
            </button>}


            <button onClick={() => {
              setShowSettings(!showSettings)
            }} data-bs-toggle="tooltip" data-bs-placement="top" title={t('Settings')} className="playercc-btn" >
              {icons.settings}
            </button>

            <button data-bs-toggle="tooltip" data-bs-placement="top" title={t('Rewind 10 seconds')} className="playercc-btn" onClick={seekBackward}>
              {icons.seekBackward}
            </button>

            <button data-bs-toggle="tooltip" data-bs-placement="top" title={t('Forward 10 seconds')} className="playercc-btn" onClick={seekForward}>
              {icons?.seekForward}
            </button>

            {!!showSettings && <div className="playercc-settings">
              <button data-bs-toggle="tooltip" data-bs-placement="top" title={t('Subtitle Alignment')} className="playercc-btn" onClick={() => {
                setDirection((dir) => {
                  if (dir === 'rtl') {
                    return 'ltr';
                  } else {
                    return 'rtl';
                  }
                })
              }}>
                {direction === 'rtl' ? icons.rightAlignment : icons.leftAlignment}
              </button>

              <button data-bs-toggle="tooltip" data-bs-placement="top" title={t('Move Subtitles Up')} className="playercc-btn" onClick={() => {
                setSubtitleMargin(subtitleMargin + 5);
                localStorage.setItem('subtitleMargin', (subtitleMargin + 5)?.toString());
              }}>
                {icons.moveUp}
              </button>
              <button data-bs-toggle="tooltip" data-bs-placement="top" title={t('Move Subtitles Down')} className="playercc-btn" onClick={() => {
                setSubtitleMargin(subtitleMargin - 5);
                localStorage.setItem('subtitleMargin', (subtitleMargin - 5)?.toString());
              }}>
                {icons.moveDown}
              </button>
              <div className="text-white"><span className="playercc-badge playercc-bg-primary">{subtitleMargin}</span></div>
              <button data-bs-toggle="tooltip" data-bs-placement="top" title={t('Delay Subtitles')} className="playercc-btn" onClick={() => {
                addOffset();
              }}>
                {icons.delaySubtitles}
              </button>
              <button data-bs-toggle="tooltip" data-bs-placement="top" title={t('Advance Subtitles')} className="playercc-btn" onClick={() => {
                removeOffset();
              }}>
                {icons.advanceSubtitles}
              </button>
              <div className="text-white"><span className="playercc-badge playercc-bg-primary">{subtitleOffset}</span></div>
            </div>}
          </div>
          <Progress fref={progressRef} onClick={handleProgressClick} isDragging={isDragging} progress={progress} onDrag={handleDrag} />

          <div className="playercc-bar">

            <button aria-label={t('Play or Pause')} data-bs-toggle="tooltip" data-bs-placement="top" className="playercc-btn" onClick={playHandler}>{!play ? icons.play : icons.pause}</button>

            {subtitles && subtitles?.length > 0 && <button data-bs-toggle="tooltip" data-bs-placement="top" title={t('Subtitles')} className="playercc-btn" onClick={() => setShowSubtitles(!showSubtitles)}>
              {icons.subtitle}

            </button>}
            <div className="playercc-right-side">
              <div className="playercc-sound-wrapper">

                {volume > 0 ?
                  <button className="playercc-btn" aria-label={t('Mute')} onClick={() => setVolume(0)}>
                    {icons?.sound}
                  </button>
                  :
                  <button className="playercc-btn" aria-label={t('Unmute')} onClick={() => setVolume(100)}>
                    {icons?.muted}
                  </button>
                }

                <Progress
                  fref={volumeProgressRef}
                  progress={volume}
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    const ratio = getVolumeRatio(e.clientX);
                    setVolume(ratio * 100);

                    if (videoRef.current) {
                      videoRef.current.volume = ratio;
                    }
                  }}
                  onDrag={handleVolumeChange}
                  width={100}
                />

              </div>

              <span className="playercc-time">
                {formatTime(currentTime)} - {formatTime(duration)}
              </span>

              <button className="playercc-btn" onClick={enterFullscreen} aria-label={t('Fullscreen')}>
                {icons.fullscreen}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`playercc-subtitles ${!showSubtitles ? 'd-none' : ''}`}>
        <strong>{t('Select Subtitle')}</strong>
        <ul>
          {subtitles?.map((subtitle) => {
            return <SubtitleButton key={subtitle?.id} lang={lang} subtitle={subtitle} selectSubtitle={selectSubtitle} activeSubtitle={activeSubtitle} />
          })}
        </ul>
      </div>
    </div>
  );
}
