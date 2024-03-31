import React from "react";
import { useVehiclePositions } from "./vehiclePositionsContext";
import { Time } from "../../components/time";
import { Coordinates } from "../../components/coordinates";
import { sortBy } from "../../lib/sortBy";

export function VehiclePositionTable() {
  const { lastSnapshot } = useVehiclePositions();
  const fifteenMinutesAgo = new Date().getTime() / 1000 - 15 * 60;
  const vehicles = lastSnapshot.filter(
    (v) => !v.isDeleted && v.vehicle?.timestamp! > fifteenMinutesAgo,
  );
  return (
    <>
      <h1>{vehicles.length} vehicles</h1>
      {vehicles.sort(sortBy((p) => -p.vehicle?.timestamp!)).map((v) => (
        <div key={v.id}>
          <Time epocSeconds={v.vehicle?.timestamp} />{" "}
          <Coordinates latitudeLongitude={v.vehicle?.position} />{" "}
          {v.vehicle?.trip?.routeId}
        </div>
      ))}
    </>
  );
}
