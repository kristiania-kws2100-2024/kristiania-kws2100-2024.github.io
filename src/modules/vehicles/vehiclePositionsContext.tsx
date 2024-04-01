import { FeedEntity, FeedMessage } from "../../../generated/gtfs-realtime";
import React, { ReactNode, useContext, useEffect, useState } from "react";
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

const context = React.createContext({
  vehicles: [] as VehiclePosition[],
  lastUpdate: new Date(0),
});

export function useVehiclePositions() {
  return useContext(context);
}

export const VEHICLE_URL =
  "https://api.entur.io/realtime/v1/gtfs-rt/vehicle-positions";

export async function fetchVehiclePositions() {
  const res = await fetch(VEHICLE_URL);
  if (!res.ok) {
    throw `Failed to fetch ${res.url}: ${res}`;
  }
  return FeedMessage.decode(new Uint8Array(await res.arrayBuffer()));
}

function valueFromEntity(e: FeedEntity) {
  const { id, vehicle } = e;
  if (!vehicle) return undefined;

  const { timestamp, trip, position } = vehicle;
  if (!timestamp || !trip || !position) return undefined;

  const { routeId } = trip;
  const { latitude, longitude } = position;
  if (!routeId || !latitude || !longitude) return undefined;

  return {
    id,
    lastUpdate: timestamp,
    lastMove: timestamp,
    routeId,
    history: [{ timestamp, coordinates: [longitude, latitude], move: 0 }],
  };
}

export function VehiclePositionsContext(props: { children: ReactNode }) {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date(0));

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
        if (!value) continue;
        const prev = updated[value.id];
        if (prev) {
          const history = [...prev.history];
          const previous = history[history.length - 1];
          const {
            history: [position],
          } = value;
          const move = metersBetween(
            previous.coordinates,
            position.coordinates,
          );
          const lastMove = move > 10 ? position.timestamp : prev.lastMove;
          history.push(position);
          if (previous.timestamp !== position.timestamp) {
            updated[value.id] = { ...prev, lastMove, history };
          }
        } else {
          updated[value.id] = value;
        }
      }
      return updated;
    });
  }

  async function updateVehiclePositions() {
    const feedMessage = await fetchVehiclePositions();
    setLastUpdate(new Date());
    updateVehicles(feedMessage.entity);
  }

  useEffect(() => {
    updateVehiclePositions();
    const intervalId = setInterval(() => updateVehiclePositions(), 15000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <context.Provider
      value={{
        lastUpdate,
        vehicles: Object.values(vehicles),
      }}
    >
      {props.children}
    </context.Provider>
  );
}
