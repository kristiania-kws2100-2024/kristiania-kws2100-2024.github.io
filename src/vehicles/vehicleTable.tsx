import { useVehicles } from "./useVehicles";
import { sortBy } from "../lib/sortBy";
import * as React from "react";

export function VehicleTable() {
  const vehicles = useVehicles();
  return (
    <>
      <h1>{vehicles.length} positions</h1>
      <div className={"vehicleTable"}>
        {vehicles
          .toSorted(sortBy((v) => -v.timestamp.getTime()))
          .map((properties) => {
            return (
              <div key={properties.id} className={"vehicleRow"}>
                <span>{properties.id}</span>
                <span>{properties.routeId}</span>
                <span>{properties.timestamp.toLocaleTimeString()}</span>
                <span>{JSON.stringify(properties.geometry)}</span>
              </div>
            );
          })}
      </div>
    </>
  );
}
