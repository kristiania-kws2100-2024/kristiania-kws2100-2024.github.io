import { useVehicles } from "./useVehicles";
import { sortBy } from "../lib/sortBy";
import * as React from "react";

export function VehicleTable() {
  const vehicles = useVehicles();
  return (
    <>
      <h1>{vehicles.length} positions</h1>
      <div className={"vehicleTable"}>
        {vehicles.toSorted(sortBy((v) => -v.timestamp!)).map((v) => (
          <div key={v.vehicle?.id} className={"vehicleRow"}>
            <span>{v.vehicle?.id}</span>
            <span>{v.trip?.tripId}</span>
            <span>{v.trip?.routeId}</span>
            <span>{new Date(v.timestamp! * 1000).toLocaleTimeString()}</span>
            <span>{v.stopId}</span>
            <span>{v.currentStatus}</span>
            <span>{v.currentStopSequence}</span>
            <span>{JSON.stringify(v.position)}</span>
          </div>
        ))}
      </div>
    </>
  );
}
