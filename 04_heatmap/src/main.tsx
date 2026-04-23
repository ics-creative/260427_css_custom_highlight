import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./app.css";

const container = document.querySelector("#app");
if (!(container instanceof HTMLElement)) {
  throw new Error("Missing #app container");
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
