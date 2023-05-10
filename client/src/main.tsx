import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CustomerProvider } from './context/CustomerProvider.tsx'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <CustomerProvider>
      <Routes>
        <Route path='/*' element={<App />} />
      </Routes>
    </CustomerProvider>
  </BrowserRouter>
)
