import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css' comentado para que no arruine el estilo en APP :D
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
