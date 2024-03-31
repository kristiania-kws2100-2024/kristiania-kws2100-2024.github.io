import React from "react";
import { useVehiclePositions } from "./vehiclePositionsContext";
import { Time } from "../../components/time";
import { sortBy } from "../../lib/sortBy";
import { VehicleTableRow } from "./vehicleTableRow";

export function VehiclePositionTable() {
  const { vehicles, lastUpdate } = useVehiclePositions();
  return (
    <>
      <h1>
        {vehicles.length} vehicles (last update <Time date={lastUpdate} />)
      </h1>
      {vehicles.sort(sortBy((p) => -p.lastUpdate)).map((v) => (
        <VehicleTableRow key={v.id} vehicle={v} />
      ))}
    </>
  );
}
