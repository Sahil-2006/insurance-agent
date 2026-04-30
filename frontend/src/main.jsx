/* ═══════════════════════════════════════════════════════════════════════════
   main.jsx — React DOM entry point
   Mounts <App /> into the root div. Nothing else belongs here.
   ═══════════════════════════════════════════════════════════════════════════ */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
