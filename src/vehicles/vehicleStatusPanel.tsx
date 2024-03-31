import * as React from "react";
import {
  useVehicles,
  VehicleProperties,
  VehiclePropertiesWithHistory,
} from "./vehicleStateProvider";
import { sortBy } from "../lib/sortBy";

function VehicleStatusRow(props: {
  onClick(): void;
  vehicle: VehiclePropertiesWithHistory;
}) {
  const { routeId, history, lastUpdate } = props.vehicle;
  return (
    <div>
      <button onClick={props.onClick}>zoom</button>
      {routeId} {new Date(lastUpdate).toTimeString().split(" ")[0]} (
      {history.length} updates)
    </div>
  );
}

export function VehicleStatusPanel({
  onClickVehicle,
}: {
  onClickVehicle: (v: VehicleProperties) => void;
}) {
  const { vehicles, lastUpdate } = useVehicles();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        background: "white",
        padding: "1em",
      }}
    >
      <h2>Vehicle status</h2>
      <div>Last update: {lastUpdate.toLocaleTimeString()}</div>
      {vehicles
        .toSorted(sortBy((v) => -new Date(v.lastUpdate).getTime()))
        .slice(0, 20)
        .map((v) => (
          <VehicleStatusRow
            key={v.id}
            vehicle={v}
            onClick={() => onClickVehicle(v)}
          />
        ))}
    </div>
  );
}
