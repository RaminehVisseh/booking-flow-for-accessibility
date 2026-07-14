import React from 'react'
import ReactDOM from 'react-dom/client'
import { BurritoProvider } from '@janeapp/burrito-design-system'
import { App } from './App'

// Keyboard focus ring — show teal ring on any focused interactive element
document.addEventListener('focusin', e => {
  const el = e.target as HTMLElement
  if (el && !el.dataset.gridOverlay) {
    el.style.setProperty('outline', '3px solid #5bbcbd', 'important')
    el.style.setProperty('outline-offset', '2px', 'important')
  }
})
document.addEventListener('focusout', e => {
  const el = e.target as HTMLElement
  if (el) {
    el.style.removeProperty('outline')
    el.style.removeProperty('outline-offset')
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BurritoProvider>
      <App />
    </BurritoProvider>
  </React.StrictMode>
)
