import React from "react";
import { useVehiclePositions } from "./vehiclePositionsContext";
import { Time } from "../../components/time";
import { sortBy } from "../../lib/sortBy";
import { VehicleTableRow } from "./vehicleTableRow";

export function VehiclePositionTable() {
  const { vehicleHistory, lastUpdate } = useVehiclePositions();
  const fifteenMinutesAgo = new Date().getTime() / 1000 - 15 * 60;
  const vehicles = Object.values(vehicleHistory).filter(
    (v) => !v[0].isDeleted && v[0].vehicle?.timestamp! > fifteenMinutesAgo,
  );
  return (
    <>
      <h1>
        {vehicles.length} vehicles (last update <Time date={lastUpdate} />)
      </h1>
      {vehicles.sort(sortBy((p) => -p[0].vehicle?.timestamp!)).map((v) => (
        <VehicleTableRow key={v[0].id} vehicle={v[0]} history={v} />
      ))}
    </>
  );
}
