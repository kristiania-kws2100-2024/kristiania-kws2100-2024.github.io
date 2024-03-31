import * as React from "react";
import { VehiclePositionsContext } from "../vehicles/vehiclePositionsContext";
import { VehicleMap } from "../vehicles/vehicleMap";

export function Application() {
  return (
    <VehiclePositionsContext>
      <VehicleMap />
    </VehiclePositionsContext>
  );
}
