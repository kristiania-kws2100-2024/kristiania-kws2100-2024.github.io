import * as React from "react";

import "./vehicles.css";
import { VehicleStateProvider } from "./vehicleStateProvider";
import { VehicleStatusPanel } from "./vehicleStatusPanel";
import { VehicleMap } from "./vehicleMap";

export function Application() {
  return (
    <VehicleStateProvider>
      <VehicleMap />
      <VehicleStatusPanel />
    </VehicleStateProvider>
  );
}
