import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CustomerProvider } from './context/CustomerProvider.js'
import { SellerProvider } from './context/SellerProvider.js'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <CustomerProvider>
      <SellerProvider>
        <Routes>
          <Route path='/*' element={<App />} />
        </Routes>
      </SellerProvider>
    </CustomerProvider>
  </BrowserRouter>
)
