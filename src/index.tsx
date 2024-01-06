import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Application } from "./modules/application/application";

const root = ReactDOM.createRoot(document.getElementById("app")!);

root.render(
  <StrictMode>
    <Application />
  </StrictMode>,
);
