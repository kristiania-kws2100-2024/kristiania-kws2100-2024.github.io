import { FeedMessage, VehiclePosition } from "../../../generated/gtfs-realtime";
import { useEffect, useState } from "react";

interface KwsVehiclePosition {
  coordinate: number[];
  timestamp: number;
}

interface KwsVehicle {
  id: string;
  routeId: string;
  position: KwsVehiclePosition;
  history: KwsVehiclePosition[];
}

function convertFromProtobuf(
  vehicle: VehiclePosition | undefined,
): KwsVehicle | undefined {
  if (!vehicle) return;
  const { position, trip, vehicle: protoVehicle } = vehicle;
  if (!position || !trip || !protoVehicle) return;
  const { id } = protoVehicle;
  const { latitude, longitude } = position;
  const { routeId } = trip;
  if (!routeId || !id) return;

  const p = {
    coordinate: [longitude, latitude],
    timestamp: 0,
  };
  return {
    id,
    routeId,
    position: p,
    history: [p],
  };
}

export function useVehicles() {
  const [vehicleTable, setVehicleTable] = useState<Record<string, KwsVehicle>>(
    JSON.parse(localStorage.getItem("vehicleTable") || "{}"),
  );
  useEffect(() => {
    localStorage.setItem("vehicleTable", JSON.stringify(vehicleTable));
  }, [vehicleTable]);
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
    setVehicleTable((old) => {
      const updated = { ...old };
      for (const v of vehicles) {
        const oldVehicle = updated[v.id];
        if (oldVehicle) {
          updated[v.id] = {
            ...oldVehicle,
            position: v.position,
            history: [...oldVehicle.history, v.position],
          };
        } else {
          updated[v.id] = v;
        }
      }
      return updated;
    });
    setVehicles(vehicles);
  }

  useEffect(() => {
    fetchVehiclePosition();
    const intervalId = setInterval(() => fetchVehiclePosition(), 15000);
    return () => clearInterval(intervalId);
  }, []);
  return Object.values(vehicleTable);
}
