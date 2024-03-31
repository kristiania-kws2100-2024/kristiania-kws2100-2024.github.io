import * as React from "react";

import "./vehicles.css";
import {
  VehicleProperties,
  VehicleStateProvider,
} from "./vehicleStateProvider";
import { VehicleStatusPanel } from "./vehicleStatusPanel";
import { VehicleMap } from "./vehicleMap";
import { useState } from "react";

export function Application() {
  const [vehicle, setVehicle] = useState<VehicleProperties | undefined>();
  return (
    <VehicleStateProvider>
      <VehicleMap vehicle={vehicle} />
      <VehicleStatusPanel onClickVehicle={setVehicle} />
    </VehicleStateProvider>
  );
}
