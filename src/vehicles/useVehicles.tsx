import { FeedMessage, VehiclePosition } from "../../generated/gtfs-realtime";
import { useEffect, useState } from "react";

const VEHICLE_POSITIONS_URL =
  "https://api.entur.io/realtime/v1/gtfs-rt/vehicle-positions";
const TRIP_UPDATES_URL =
  "https://api.entur.io/realtime/v1/gtfs-rt/trip-updates";

export interface Point {
  type: "Point";
  coordinates: number[];
}

export interface VehicleFeature {
  properties: VehicleProperties;
  geometry: Point;
}

export interface VehicleProperties {
  id: string;
  timestamp: Date;
  routeId: string;
  bearing?: number;
  rawData: VehiclePosition;
}

export function useVehicles(): VehicleFeature[] {
  const [vehicles, setVehicles] = useState<Record<string, VehicleFeature>>({});

  async function fetchVehiclePositions() {
    const res = await fetch(VEHICLE_POSITIONS_URL);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${VEHICLE_POSITIONS_URL}: ${res}`);
    }
    const feedMessage = FeedMessage.decode(
      new Uint8Array(await res.arrayBuffer()),
    );
    setVehicles((old) => {
      const updates: Record<string, VehicleFeature> = {};
      for (const e of feedMessage.entity) {
        const vehicle = e.vehicle;
        if (!vehicle?.position) continue;
        if (
          !old[e.id] ||
          old[e.id].properties.rawData.timestamp! < vehicle.timestamp!
        ) {
          const { longitude, latitude, bearing } = vehicle.position;
          updates[e.id] = {
            geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            properties: {
              id: e.id,
              routeId: vehicle.trip?.routeId!,
              timestamp: new Date(vehicle.timestamp!),
              bearing,
              rawData: vehicle,
            },
          };
        }
      }
      return {
        ...old,
        ...updates,
      };
    });
  }

  useEffect(() => {
    fetchVehiclePositions().then();
    const interval = setInterval(() => fetchVehiclePositions(), 15000);
    return () => clearInterval(interval);
  }, []);

  return Object.values(vehicles);
}
