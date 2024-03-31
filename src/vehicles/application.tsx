import { useVehicles } from "./useVehicles";
import * as React from "react";

import "./vehicles.css";

export function Application() {
  const vehicles = useVehicles();
  return (
    <>
      <h1>{vehicles.length} positions</h1>
      <div className={"vehicleTable"}>
        {vehicles.map((v) => (
          <div key={v.vehicle?.id} className={"vehicleRow"}>
            <span>{v.vehicle?.id}</span>
            <span>{v.trip?.tripId}</span>
            <span>{v.trip?.routeId}</span>
            <span>{v.timestamp}</span>
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
