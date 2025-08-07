### 📺 React Custom Player
react-player-cc is a lightweight and customizable React video player component with built-in support for:

Custom controls (play/pause, volume, progress bar, etc.)

SRT subtitle loading and parsing

Seamless integration with React projects

Minimal setup — just import the component and stylesheet

### ✅ Example Usage

```ts
import 'react-player-cc/style.css'
import ReactPlayerCC from 'react-player-cc'

function App() {
  return <ReactPlayerCC src="/video.mp4" subtitles={[{ id: 1, title: 'test', link: "/subs.srt" }]} />
}
```

### 🛠 Features

🎛 Custom built controls (not using the browser's native controls)

💬 SRT subtitle support out of the box

⚛ Built with React + TypeScript

🎨 Easily styleable with your own CSS

🚫 No external dependencies beyond react and react-dom

### 📦 Installation
Install via NPM:

```
npm install react-player-cc
```

```
yarn add react-player-cc
```

### Using Custom Players with `playerClass`

By default, this package uses the native `<video>` element for playback.  
However, you can pass a class that implements the `PlayerInterface` to use any custom player you want — such as **HLS**, **DASH**, **WebRTC**, and more.

### Example: Using HLS.js

First, install **Hls.js**:

```bash
npm install hls.js
```

Create a custom player class for HLS:

```ts
import Hls from "hls.js";
import { PlayerInterface } from "./PlayerInterface";

export class HlsVideoPlayer implements PlayerInterface {
  private hls: Hls;
  private video: HTMLVideoElement;

  constructor(video: HTMLVideoElement) {
    this.video = video;
    this.hls = new Hls();
    this.hls.attachMedia(video);
  }

  load(src: string) {
    if (Hls.isSupported()) {
      this.hls.loadSource(src);
    } else if (this.video.canPlayType("application/vnd.apple.mpegurl")) {
      this.video.src = src;
    }
  }

  play() {
    this.video.play();
  }

  pause() {
    this.video.pause();
  }

  destroy() {
    this.hls.destroy();
  }
}
```

Now simply pass the class to the playerClass prop:

```ts
<ReactPlayerCC
src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
playerClass={HlsVideoPlayer}
/>
```