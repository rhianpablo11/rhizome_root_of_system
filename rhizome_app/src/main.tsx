import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import Home from "./pages/home";
import BaseLayout from "./pages/BaseLayout/BaseLayout";
import MainMenu from "./pages/MainMenu/MainMenu";
import OfflineGame from "./pages/offlineGame";
import RoleReveal from "./pages/RoleReveal";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<BaseLayout />}>
                      <Route index element={<MainMenu />} />
                      <Route path="/home" element={<Home />} />
                      <Route path="/role-reveal" element={<RoleReveal />} />
                </Route>
                <Route path="/offline" element={<OfflineGame />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
