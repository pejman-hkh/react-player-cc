import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactPlayerCC from './ReactPlayerCC.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactPlayerCC subtitles={[{ id: 1, default: true, title: 'test', link: 'sub.srt' }]} src="video.mp4" />
  </StrictMode>,
)
