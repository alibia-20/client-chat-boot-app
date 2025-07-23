import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import axios from "axios";
axios.defaults.withCredentials = true; //est utilisé pour inclure automatiquement les cookies et les en-têtes d'authentification dans les requêtes faites avec Axios.
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
