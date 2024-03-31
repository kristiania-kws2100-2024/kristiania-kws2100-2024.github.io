import * as React from "react";
import { VehiclePositionsContext } from "../vehicles/vehiclePositionsContext";
import { VehiclePositionTable } from "../vehicles/vehiclePositionTable";

export function Application() {
  return (
    <VehiclePositionsContext>
      <VehiclePositionTable />
    </VehiclePositionsContext>
  );
}
