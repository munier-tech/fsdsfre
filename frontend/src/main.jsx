import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            borderRadius: '0.5rem',
            border: '1px solid #374151',
          },
          success: {
            style: {
              background: '#065f46',
              color: '#d1fae5',
            },
          },
          error: {
            style: {
              background: '#7f1d1d',
              color: '#fecaca',
            },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)
