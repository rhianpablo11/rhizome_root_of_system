import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/home'
import BaseLayout from './pages/BaseLayout/BaseLayout'
import MainMenu from './pages/MainMenu/MainMenu'
import Navbar from './pages/Navbar/Navbar'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<BaseLayout />}>
              <Route path="/" element={<Navbar />}>
                <Route index element={<MainMenu />}/>
                <Route path="/home" element={<Home />}/>
              </Route>
            </Route>
          </Routes>
      </BrowserRouter>
    </StrictMode>
)
