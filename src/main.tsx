import * as React from "react";
import { createRoot } from "react-dom/client";
import { TransitMapApplication } from "./components/app/transitMapApplication";

const root = createRoot(document.getElementById("root")!);

root.render(<TransitMapApplication />);
