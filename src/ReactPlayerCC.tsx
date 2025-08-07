"use client"
import React, { type MouseEvent, type ReactNode, type RefObject, useCallback, useEffect, useRef, useState } from 'react';
import './ReactPlayerCC.css';
import Spinner from './Spinner';
import { formatTime, makeBlobUrl } from './utils';
import { Progress } from './Progress';
import { useTranslator, type LangCode } from './lang';

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
  src?: string,
  subtitles?: SubtitleType[],
  lang?: LangCode,
  onPlay?: (video: RefObject<HTMLVideoElement | null>, isFullScreen: boolean) => void,
  onPause?: (video: RefObject<HTMLVideoElement | null>, isFullScreen: boolean) => void,
  onLoad?: (selectSubtitle: (subtitle: SubtitleType) => Promise<string | undefined>) => void,
  onFullScreen?: (isFullScreen: boolean) => void,
};

export default function ReactPlayerCC({
  alert,
  children,
  id,
  src,
  subtitles,
  lang = "en",
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
        video.play().catch((err) => {
          console.error(err);
        });
      }
    } else {
      if (onPause) {
        onPause(videoRef, isFullScreen);
      }
      if (hasSrc) {
        video.pause();
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
    const json = await api.json();
    const data: Array<string> = json?.data;
    const subtitleText = data?.[0];
    if (trackRef.current) {
      trackRef.current.src = makeBlobUrl(subtitleText);
    }

    loadSubtitle();
    setActiveSubtitle(subtitle?.id);

    return subtitleText;
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

  useEffect(() => {

    const video = videoRef?.current;
    if (video) {
      video.src = src || "";
    }
    return () => {

      if (video) {
        video.pause();
        video.src = '';
        video.load();
      }
    };
  }, [src]);

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
                video.play();
                setPlay(true);
              } else {
                video.pause();
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
      className={"player-container" + (isFullScreen ? " player-fullscreen" : "")}
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
          videoRef.current!.play().catch((err) => {
            console.error(err);
          });
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


      {loading && <div className="player-title">
        <Spinner />
      </div>}

      {!loading && !play && <div className="player-title player-title-no-background" onClick={() => {
        setShowSubtitles(false);
        if (!showSubtitles) {
          playHandler();
        }
      }}>
        <div className="player-play-icon">
          <i>
            <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play-icon lucide-play"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" /></svg>
          </i>
        </div>
        {alert}
      </div>}

      <div className={"player-bar-wrapper"} ref={playerBarRef}>
        {children}

        {activeCue !== "" && <div className="player-subtitle" style={{ marginBottom: subtitleMargin }} dir={direction} dangerouslySetInnerHTML={{ __html: activeCue }}></div>}

        <div className={"player-bars" + (!barVisibility ? " v-none" : "")}>


          <div className="player-bar">


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
                videoRef.current!.play().catch((err) => {
                  console.error(err);
                });
              }
            }} className="player-fromfirst">
              <h5>{t('Play from First')}</h5>
            </button>}


            <button onClick={() => {
              setShowSettings(!showSettings)
            }} data-bs-toggle="tooltip" data-bs-placement="top" title={t('Settings')} className="player-btn" >
              <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings-icon lucide-settings"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /><circle cx={12} cy={12} r={3} /></svg>


            </button>

            <button data-bs-toggle="tooltip" data-bs-placement="top" title={t('Rewind 10 seconds')} className="player-btn" onClick={seekBackward}>
              <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-backward">
                <path d="m9 17-5-5 5-5" />
                <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
              </svg>

            </button>

            <button data-bs-toggle="tooltip" data-bs-placement="top" title={t('Forward 10 seconds')} className="player-btn" onClick={seekForward}>
              <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-forward-icon lucide-forward"><path d="m15 17 5-5-5-5" /><path d="M4 18v-2a4 4 0 0 1 4-4h12" /></svg>

            </button>

            {!!showSettings && <div className="player-settings">
              <button data-bs-toggle="tooltip" data-bs-placement="top" title={t('Subtitle Alignment')} className="player-btn" onClick={() => {
                setDirection((dir) => {
                  if (dir === 'rtl') {
                    return 'ltr';
                  } else {
                    return 'rtl';
                  }
                })
              }}>
                {direction === 'rtl' ?
                  <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-align-left-icon lucide-align-left"><path d="M15 12H3" /><path d="M17 18H3" /><path d="M21 6H3" /></svg>

                  :
                  <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-align-right-icon lucide-align-right"><path d="M21 12H9" /><path d="M21 18H7" /><path d="M21 6H3" /></svg>

                }
              </button>

              <button data-bs-toggle="tooltip" data-bs-placement="top" title={t('Move Subtitles Up')} className="player-btn" onClick={() => {
                setSubtitleMargin(subtitleMargin + 5);
                localStorage.setItem('subtitleMargin', (subtitleMargin + 5)?.toString());
              }}>
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>

              </button>
              <button data-bs-toggle="tooltip" data-bs-placement="top" title={t('Move Subtitles Down')} className="player-btn" onClick={() => {
                setSubtitleMargin(subtitleMargin - 5);
                localStorage.setItem('subtitleMargin', (subtitleMargin - 5)?.toString());
              }}>
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>

              </button>
              <div className="text-white"><span className="badge bg-primary">{subtitleMargin}</span></div>
              <button data-bs-toggle="tooltip" data-bs-placement="top" title={t('Delay Subtitles')} className="player-btn" onClick={() => {
                addOffset();
              }}>
                <svg fill="currentColor" width={24} height={24} viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">

                  <path d="M31.218 15.838c-0.007-0.058-0.018-0.109-0.031-0.159l0.002 0.008c-0.051-0.223-0.158-0.416-0.305-0.571l0 0.001-5-5c-0.226-0.227-0.539-0.367-0.885-0.367-0.691 0-1.251 0.56-1.251 1.251 0 0.345 0.14 0.658 0.366 0.884v0l2.867 2.866h-18.982c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h18.981l-2.866 2.865c-0.226 0.226-0.366 0.539-0.366 0.884 0 0.691 0.56 1.251 1.251 1.251 0.345 0 0.658-0.14 0.884-0.366l5-5.001c0.012-0.012 0.016-0.029 0.027-0.041 0.099-0.103 0.18-0.223 0.239-0.356l0.003-0.008 0-0.003c0.051-0.13 0.080-0.28 0.080-0.437 0-0.071-0.006-0.141-0.017-0.208l0.001 0.007zM2 0.75c-0.69 0-1.25 0.56-1.25 1.25v0 28c0 0.69 0.56 1.25 1.25 1.25s1.25-0.56 1.25-1.25v0-28c0-0.69-0.56-1.25-1.25-1.25v0z" />
                </svg>

              </button>
              <button data-bs-toggle="tooltip" data-bs-placement="top" title={t('Advance Subtitles')} className="player-btn" onClick={() => {
                removeOffset();
              }}>
                <svg fill="currentColor" width={24} height={24} viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">

                  <path d="M24 14.75h-18.982l2.866-2.866c0.225-0.226 0.363-0.537 0.363-0.881 0-0.69-0.56-1.25-1.25-1.25-0.344 0-0.655 0.139-0.881 0.363l-5 5c-0.011 0.011-0.015 0.027-0.026 0.039-0.1 0.104-0.183 0.225-0.243 0.359l-0.003 0.008-0 0.004c-0.050 0.129-0.079 0.279-0.079 0.435 0 0.072 0.006 0.142 0.018 0.21l-0.001-0.007c0.007 0.058 0.018 0.108 0.031 0.158l-0.002-0.008c0.051 0.223 0.158 0.417 0.306 0.571l-0-0 5 5.001c0.226 0.226 0.539 0.366 0.884 0.366 0.691 0 1.251-0.56 1.251-1.251 0-0.346-0.14-0.658-0.367-0.885l-2.866-2.865h18.982c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0zM30 0.75c-0.69 0-1.25 0.56-1.25 1.25v28c0 0.69 0.56 1.25 1.25 1.25s1.25-0.56 1.25-1.25v0-28c-0-0.69-0.56-1.25-1.25-1.25h-0z" />
                </svg>

              </button>
              <div className="text-white"><span className="badge bg-primary">{subtitleOffset}</span></div>
            </div>}
          </div>
          <Progress fref={progressRef} onClick={handleProgressClick} isDragging={isDragging} progress={progress} onDrag={handleDrag} />

          <div className="player-bar">

            <button aria-label={t('Play or Pause')} data-bs-toggle="tooltip" data-bs-placement="top" className="player-btn" onClick={playHandler}>{!play ?
              <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play-icon lucide-play"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" /></svg>
              : <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-icon lucide-square"><rect width={18} height={18} x={3} y={3} rx={2} /></svg>

            }</button>

            {subtitles && subtitles?.length > 0 && <button data-bs-toggle="tooltip" data-bs-placement="top" title={t('Subtitles')} className="player-btn" onClick={() => setShowSubtitles(!showSubtitles)}>
              <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-closed-caption-icon lucide-closed-caption"><path d="M10 9.17a3 3 0 1 0 0 5.66" /><path d="M17 9.17a3 3 0 1 0 0 5.66" /><rect x={2} y={5} width={20} height={14} rx={2} /></svg>

            </button>}
            <div className="player-right-side">
              <div className="player-sound-wrapper">

                {volume > 0 ?
                  <button className="player-btn" aria-label={t('Mute')} onClick={() => setVolume(0)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume2-icon lucide-volume-2"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" /><path d="M16 9a5 5 0 0 1 0 6" /><path d="M19.364 18.364a9 9 0 0 0 0-12.728" /></svg>

                  </button>
                  :
                  <button className="player-btn" aria-label={t('Unmute')} onClick={() => setVolume(100)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-off-icon lucide-volume-off"><path d="M16 9a5 5 0 0 1 .95 2.293" /><path d="M19.364 5.636a9 9 0 0 1 1.889 9.96" /><path d="m2 2 20 20" /><path d="m7 7-.587.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298V11" /><path d="M9.828 4.172A.686.686 0 0 1 11 4.657v.686" /></svg>

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

              <span className="player-time">
                {formatTime(currentTime)} - {formatTime(duration)}
              </span>

              <button className="player-btn" onClick={enterFullscreen} aria-label={t('Fullscreen')}>

                <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-fullscreen-icon lucide-fullscreen"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><rect width={10} height={8} x={7} y={8} rx={1} /></svg>

              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`player-subtitles ${!showSubtitles ? 'd-none' : ''}`}>
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
