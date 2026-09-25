import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => {
        console.log(
          "✅ ClassPing service worker registered"
        );
      })
      .catch((error) => {
        console.error(
          "❌ Service worker registration failed:",
          error
        );
      });
  });
}

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);