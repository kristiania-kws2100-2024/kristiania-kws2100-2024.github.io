import React from "react";
import { useVehiclePositions } from "./vehiclePositionsContext";
import { Time } from "../../components/time";
import { Coordinates } from "../../components/coordinates";
import { sortBy } from "../../lib/sortBy";
import { FeedEntity } from "../../../generated/gtfs-realtime";

function VehicleRow(props: { vehicle: FeedEntity }) {
  const v = props.vehicle;
  const { vehicle } = v;
  if (!vehicle) return null;
  return (
    <div>
      <Time epocSeconds={vehicle.timestamp} />{" "}
      <Coordinates latitudeLongitude={vehicle.position} />{" "}
      {vehicle.trip?.routeId}
    </div>
  );
}

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
        <VehicleRow key={v.id} vehicle={v} />
      ))}
    </>
  );
}
