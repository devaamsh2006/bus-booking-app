import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import UserAuthentication from './context/UserAuthentication.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserAuthentication>
      <App />
    </UserAuthentication>
  </StrictMode>,
)
