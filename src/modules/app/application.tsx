import * as React from "react";
import { VehiclePositionsContext } from "../vehicles/vehiclePositionsContext";
import { VehicleMap } from "../vehicle/vehicleMap";

export function Application() {
  return (
    <VehiclePositionsContext>
      <VehicleMap />
    </VehiclePositionsContext>
  );
}
