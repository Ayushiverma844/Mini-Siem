import { StrictMode } from "react";
import { createRoot } from "react-dom/client";


import "./index.css";
import App from "./App.jsx";

import {
  ThreatProvider,
} from "./context/ThreatContext";

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <ThreatProvider>
      <App />
    </ThreatProvider>
  </StrictMode>
);