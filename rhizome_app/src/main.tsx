import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/home'
import BaseLayout from './pages/BaseLayout/BaseLayout'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<BaseLayout />}>
              <Route index element={<Home />}/>
            </Route>
          </Routes>
      </BrowserRouter>
    </StrictMode>
)
