import '@patternfly/react-core/dist/styles/base.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Make sure to add the CSS imports as the last import
import '@patternfly/chatbot/dist/css/main.css'
import { ChatApp } from './Chat'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ChatApp />
  </StrictMode>,
)
