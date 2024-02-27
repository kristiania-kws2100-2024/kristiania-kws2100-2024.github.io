import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App.tsx";

const root = createRoot(document.getElementById("root"));
root.render(<App />);

