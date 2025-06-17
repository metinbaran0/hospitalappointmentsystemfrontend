// main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom' // Bu satırı ekleyin
import App from './App'
import { store } from './store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter> {/* Bu bileşeni ekleyin */}
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)