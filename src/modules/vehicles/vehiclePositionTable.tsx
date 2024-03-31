import React from "react";
import { useVehiclePositions } from "./vehiclePositionsContext";
import { Time } from "../../components/time";
import { Coordinates } from "../../components/coordinates";
import { sortBy } from "../../lib/sortBy";
import { FeedEntity } from "../../../generated/gtfs-realtime";

function VehicleRow(props: { vehicle: FeedEntity; history: FeedEntity[] }) {
  const v = props.vehicle;
  const { vehicle } = v;
  if (!vehicle) return null;
  return (
    <div>
      <Time epocSeconds={vehicle.timestamp} />{" "}
      <Coordinates latitudeLongitude={vehicle.position} />{" "}
      {vehicle.trip?.routeId} (history: {props.history.length})
    </div>
  );
}

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
        <VehicleRow key={v[0].id} vehicle={v[0]} history={v} />
      ))}
    </>
  );
}
