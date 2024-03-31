import * as React from "react";
import { createRoot } from "react-dom/client";
import { useVehicles } from "./vehicles/useVehicles";

const root = createRoot(document.getElementById("root")!);

function Application() {
  const vehicles = useVehicles();
  return <h1>Hello world, there are {vehicles.length} positions</h1>;
}

root.render(<Application />);
