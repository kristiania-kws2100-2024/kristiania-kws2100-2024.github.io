import { ReactNode } from "react";
import { FeedMessage, VehiclePosition } from "../../generated/gtfs-realtime";

export function VehicleStateProvider(props: { children: ReactNode }) {
  return props.children;
}

export interface VehicleProperties {
  geometry: {
    type: "Point";
    coordinates: number[];
  };
  id: string;
  timestamp: Date;
  routeId: string;
  bearing?: number;
  rawData: VehiclePosition;
}

const VEHICLE_POSITIONS_URL =
  "https://api.entur.io/realtime/v1/gtfs-rt/vehicle-positions";

export async function fetchVehicleFeed() {
  const res = await fetch(VEHICLE_POSITIONS_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${VEHICLE_POSITIONS_URL}: ${res}`);
  }
  return FeedMessage.decode(new Uint8Array(await res.arrayBuffer()));
}

export async function fetchVehicleFeatures() {
  const feedMessage = await fetchVehicleFeed();
  const features: VehicleProperties[] = [];
  for (const { id, vehicle } of feedMessage.entity) {
    if (!vehicle || !vehicle.position || !vehicle.timestamp || !vehicle.trip)
      continue;
    const { position } = vehicle;
    const { longitude, latitude, bearing } = position;
    const routeId = vehicle.trip.routeId!;
    const timestamp = new Date(vehicle.timestamp * 1000);
    const rawData = vehicle;
    const geometry = {
      type: "Point" as const,
      coordinates: [longitude, latitude],
    };
    features.push({ geometry, id, routeId, bearing, rawData, timestamp });
  }
  return features;
}
