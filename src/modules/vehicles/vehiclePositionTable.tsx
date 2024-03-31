import React from "react";
import { useVehiclePositions } from "./vehiclePositionsContext";

export function VehiclePositionTable() {
  const { vehicles } = useVehiclePositions();
  return <h1>{vehicles.length} vehicles</h1>;
}
