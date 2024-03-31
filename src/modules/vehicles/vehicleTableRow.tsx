import { Time } from "../../components/time";
import { Coordinates } from "../../components/coordinates";
import React from "react";
import { VehiclePosition } from "./vehiclePositionsContext";

export function VehicleTableRow({ vehicle }: { vehicle: VehiclePosition }) {
  return (
    <div>
      <Time epocSeconds={vehicle.lastMove} />{" "}
      <Coordinates coordinates={vehicle.history[0].coordinates} /> {vehicle.id}{" "}
      {vehicle.routeId} (history: {vehicle.history.length})
      <ul>
        {vehicle.history.map((h) => (
          <li key={h.timestamp}>
            <Time epocSeconds={h.timestamp} />
            {"  "}
            <Coordinates coordinates={h.coordinates} />
            {" (distance " + h.move + "}"}
          </li>
        ))}
      </ul>
    </div>
  );
}
