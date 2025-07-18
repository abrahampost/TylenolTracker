import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.tsx'
import { DosesProvider } from './features/dosing/store/doses.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DosesProvider>
        <App />
    </DosesProvider>
  </StrictMode>,
)
