import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import ShiftNomad from '../apps/ShiftNomad.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ShiftNomad />
  </StrictMode>,
)
