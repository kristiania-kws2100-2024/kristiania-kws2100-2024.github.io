import { FeedMessage, VehiclePosition } from "../../generated/gtfs-realtime";
import { useEffect, useState } from "react";

const VEHICLE_POSITIONS_URL =
  "https://api.entur.io/realtime/v1/gtfs-rt/vehicle-positions";
const TRIP_UPDATES_URL =
  "https://api.entur.io/realtime/v1/gtfs-rt/trip-updates";

export function useVehicles(): VehiclePosition[] {
  const [vehicles, setVehicles] = useState<Record<string, VehiclePosition>>({});

  async function fetchVehiclePositions() {
    const res = await fetch(VEHICLE_POSITIONS_URL);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${VEHICLE_POSITIONS_URL}: ${res}`);
    }
    const feedMessage = FeedMessage.decode(
      new Uint8Array(await res.arrayBuffer()),
    );
    setVehicles((old) => ({
      ...old,
      ...Object.fromEntries(feedMessage.entity.map((v) => [v.id, v.vehicle!])),
    }));
  }

  useEffect(() => {
    fetchVehiclePositions().then();
  }, []);

  return Object.values(vehicles);
}
