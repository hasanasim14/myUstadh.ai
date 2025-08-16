import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="1052281490895-5f7s20feriag1p4m4018qggka93m1qsm.apps.googleusercontent.com">
      <BrowserRouter>
        <App />
        <Toaster position="top-center" />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
