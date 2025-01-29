import React from "react";
import App from "../App";
import { Route, Routes } from "react-router";
import ChatPage from "../components/ChatPage";

function AppRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </div>
  );
}

export default AppRoutes;
