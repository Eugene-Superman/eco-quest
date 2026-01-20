import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import { ReduxProvider } from "./providers";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider>
      <App />
    </ReduxProvider>
  </StrictMode>,
);
