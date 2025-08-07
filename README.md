# React Custom Player
react-player-cc is a lightweight and customizable React video player component with built-in support for:

Custom controls (play/pause, volume, progress bar, etc.)

SRT subtitle loading and parsing

Seamless integration with React projects

Minimal setup — just import the component and stylesheet

# ✅ Example Usage

```ts
import 'react-player-cc/style.css'
import ReactPlayerCC from 'react-player-cc'

function App() {
  return <ReactPlayerCC src="/video.mp4" subtitles={[{ id: 1, title: 'test', link: "/subs.srt" }]} />
}
```

# 🛠 Features

🎛 Custom built controls (not using the browser's native controls)

💬 SRT subtitle support out of the box

⚛ Built with React + TypeScript

🎨 Easily styleable with your own CSS

🚫 No external dependencies beyond react and react-dom

# 📦 Installation
Install via NPM:

```
npm install react-player-cc
```

```
yarn add react-player-cc
```
