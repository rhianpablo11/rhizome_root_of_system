import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import OfflineGame from "./pages/offlineGame";
import InitialPage from "./pages/initialPage";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<InitialPage />}>
                    {/* <Route path="/" element={<Navbar />}>
                        <Route index element={<MainMenu />} />
                        <Route path="/home" element={<Home />} />
                    </Route> */}
                </Route>
                <Route path="/offline" element={<OfflineGame />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
