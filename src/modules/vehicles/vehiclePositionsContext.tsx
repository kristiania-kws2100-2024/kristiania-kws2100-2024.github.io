import { FeedEntity, FeedMessage } from "../../../generated/gtfs-realtime";
import React, {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  lastSnapshot: [] as FeedEntity[],
  vehicleHistory: {} as Record<string, FeedEntity[]>,
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

export function VehiclePositionsContext(props: { children: ReactNode }) {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date(0));
  const [vehiclePositions, setVehiclePositions] = useState<
    FeedMessage | undefined
  >();
  const [vehicleHistory, setVehicleHistory] = useState<
    Record<string, FeedEntity[]>
  >(JSON.parse(localStorage.getItem("vehiclePositionHistory") || "{}"));
  useEffect(() => {
    localStorage.setItem(
      "vehiclePositionHistory",
      JSON.stringify(vehicleHistory),
    );
  }, [vehicleHistory]);
  const vehicles = useMemo<VehiclePosition[]>(
    () =>
      Object.values(vehicleHistory).map((h) => {
        let lastMove = 0;
        let previous: VehiclePositionAtTime | undefined;
        const history = [] as VehiclePositionAtTime[];
        for (const feedEntity of h.toReversed()) {
          const position = feedEntity.vehicle?.position;
          const timestamp = feedEntity.vehicle?.timestamp;
          if (!position || !timestamp) continue;
          const { latitude, longitude } = position;
          const coordinates = [longitude, latitude];
          if (previous) {
            if (timestamp === previous.timestamp) continue;
            const move = metersBetween(previous.coordinates, coordinates);
            if (move > 10) {
              lastMove = timestamp;
            }
            previous = { move, coordinates, timestamp };
            history.push(previous);
          } else {
            previous = { move: 0, coordinates, timestamp };
            history.push(previous);
          }
        }
        return {
          id: h[0].id,
          routeId: h[0].vehicle?.trip?.routeId!,
          lastUpdate: h[0].vehicle?.timestamp!,
          lastMove,
          history,
        };
      }),
    [vehicleHistory],
  );
  useEffect(() => {
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
  }, [vehicles]);

  async function updateVehiclePositions() {
    const feedMessage = await fetchVehiclePositions();
    setLastUpdate(new Date());
    setVehiclePositions(feedMessage);
    setVehicleHistory((old) => {
      return Object.fromEntries(
        feedMessage.entity
          .filter((e) => e.vehicle?.trip?.routeId?.startsWith("AKT:"))
          .map((e) => [e.id, [e, ...(old[e.id] || [])]]),
      );
    });
  }

  useEffect(() => {
    updateVehiclePositions();
    const intervalId = setInterval(() => updateVehiclePositions(), 15000);
    return () => clearInterval(intervalId);
  }, []);

  const value = {
    lastSnapshot: vehiclePositions?.entity || [],
    vehicleHistory,
    lastUpdate,
    vehicles,
  };
  return <context.Provider value={value}>{props.children}</context.Provider>;
}
