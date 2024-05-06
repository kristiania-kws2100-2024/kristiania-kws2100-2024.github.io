import * as React from "react";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root")!);

function Application() {
  return <h1>Hello React</h1>;
}

root.render(<Application />);
