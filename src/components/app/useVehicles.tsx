import { FeedMessage, VehiclePosition } from "../../../generated/gtfs-realtime";
import { useEffect, useState } from "react";

interface KwsVehicle {
  routeId: string;
  coordinate: number[];
}

function convertFromProtobuf(
  vehicle: VehiclePosition | undefined,
): KwsVehicle | undefined {
  if (!vehicle) return;
  const { position, trip } = vehicle;
  if (!position || !trip) return;
  const { latitude, longitude } = position;
  const { routeId } = trip;
  if (!routeId) return;

  return {
    routeId,
    coordinate: [longitude, latitude],
  };
}

export function useVehicles() {
  const [vehicles, setVehicles] = useState<KwsVehicle[]>([]);

  async function fetchVehiclePosition() {
    const res = await fetch(
      "https://api.entur.io/realtime/v1/gtfs-rt/vehicle-positions",
    );
    if (!res.ok) {
      throw `Error fetching ${res.url}: ${res.statusText}`;
    }
    const responseMessage = FeedMessage.decode(
      new Uint8Array(await res.arrayBuffer()),
    );
    const vehicles: KwsVehicle[] = [];
    for (const { vehicle } of responseMessage.entity) {
      const v = convertFromProtobuf(vehicle);
      if (v) vehicles.push(v);
    }
    setVehicles(vehicles);
  }

  useEffect(() => {
    fetchVehiclePosition();
  }, []);
  return vehicles;
}
