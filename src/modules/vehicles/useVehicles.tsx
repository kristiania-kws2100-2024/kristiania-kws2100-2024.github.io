import { useEffect, useState } from "react";
import { FeedEntity } from "../../../generated/gtfs-realtime";
import { metersBetween } from "../../components/coordinates";

interface VehiclePositionAtTime {
  timestamp: number;
  coordinates: number[];
  move: number;
}

export interface VehiclePosition {
  id: string;
  routeId: string;
  lastUpdate: number;
  lastMove: number;
  history: VehiclePositionAtTime[];
}

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Record<string, VehiclePosition>>(
    JSON.parse(localStorage.getItem("vehicles") || "{}"),
  );
  useEffect(() => {
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
  }, [vehicles]);

  function updateVehicles(entity: FeedEntity[]) {
    setVehicles((old) => {
      const updated = { ...old };
      for (const e of entity) {
        const value = valueFromEntity(e);
        if (value) {
          updated[value.id] = updateVehicle(value, updated[value.id]);
        }
      }
      return updated;
    });
  }

  return { vehicles: Object.values(vehicles), updateVehicles };
}

function valueFromEntity({ vehicle: entity }: FeedEntity) {
  if (!entity) return undefined;

  const { timestamp, trip, position, vehicle } = entity;
  if (!timestamp || !trip || !position || !vehicle) return undefined;

  const { id } = vehicle;
  const { routeId } = trip;
  const { latitude, longitude } = position;
  if (!routeId || !latitude || !longitude || !id) return undefined;

  const history = [{ timestamp, coordinates: [longitude, latitude], move: 0 }];
  return { id, lastUpdate: timestamp, lastMove: 0, routeId, history };
}

function updateVehicle(value: VehiclePosition, prev?: VehiclePosition) {
  if (!prev) return value;

  const twoHoursAgo = new Date().getTime() / 1000 - 2 * 60 * 60;
  const history = prev.history.filter(
    ({ timestamp }) => timestamp > twoHoursAgo,
  );
  if (history.length <= 0) return value;
  const previous = history[history.length - 1];
  const {
    history: [position],
  } = value;
  const move = metersBetween(previous.coordinates, position.coordinates);
  const lastMove = move > 10 ? position.timestamp : prev.lastMove;
  if (previous.timestamp !== position.timestamp) {
    return { ...prev, lastMove, history: [...history, position] };
  } else {
    return prev;
  }
}
