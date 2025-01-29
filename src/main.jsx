import { createRoot } from "react-dom/client";
import Approutes from "./config/Routes";
import { BrowserRouter } from "react-router";
import { Toaster } from "react-hot-toast";
import { ChatProvider } from "./context/ChatContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Toaster />
    <ChatProvider>
      <Approutes />
    </ChatProvider>
  </BrowserRouter>
);
