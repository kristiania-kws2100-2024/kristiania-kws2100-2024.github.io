import { FeedEntity } from "../../../generated/gtfs-realtime";
import { Time } from "../../components/time";
import { Coordinates } from "../../components/coordinates";
import React from "react";

export function VehicleTableRow(props: {
  vehicle: FeedEntity;
  history: FeedEntity[];
}) {
  const v = props.vehicle;
  const { vehicle } = v;
  if (!vehicle) return null;
  return (
    <div>
      <Time epocSeconds={vehicle.timestamp} />{" "}
      <Coordinates latitudeLongitude={vehicle.position} /> {vehicle.vehicle?.id}{" "}
      {vehicle.trip?.routeId} (history: {props.history.length})
      <ul>
        {props.history.map((h) => (
          <li key={h.vehicle?.timestamp}>
            <Time epocSeconds={h.vehicle?.timestamp} />
            {"  "}
            <Coordinates latitudeLongitude={h.vehicle?.position} />
          </li>
        ))}
      </ul>
    </div>
  );
}
