import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import SporeSpot from '../apps/SporeSpot.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SporeSpot />
  </StrictMode>,
)
