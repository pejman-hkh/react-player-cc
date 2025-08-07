import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactPlayerx from './ReactPlayerCC.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactPlayerx subtitles={[{ id: 1, default: true, title: 'test', link: '' }]} src="" />
  </StrictMode>,
)
