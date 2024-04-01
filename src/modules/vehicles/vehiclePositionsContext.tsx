import { FeedMessage } from "../../../generated/gtfs-realtime";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import { useVehicles, VehiclePosition } from "./useVehicles";

const context = React.createContext({
  vehicles: [] as VehiclePosition[],
  lastUpdate: new Date(0),
});

export function useVehiclePositions() {
  return useContext(context);
}

export const VEHICLE_URL =
  "https://api.entur.io/realtime/v1/gtfs-rt/vehicle-positions";

export async function fetchVehiclePositions(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw `Failed to fetch ${res.url}: ${res}`;
  }
  return FeedMessage.decode(new Uint8Array(await res.arrayBuffer()));
}

export function VehiclePositionsContext(props: { children: ReactNode }) {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date(0));
  const { vehicles, updateVehicles } = useVehicles();

  async function updateVehiclePositions() {
    const feedMessage = await fetchVehiclePositions(VEHICLE_URL);
    setLastUpdate(new Date());
    updateVehicles(feedMessage.entity);
  }

  useEffect(() => {
    updateVehiclePositions();
    const intervalId = setInterval(() => updateVehiclePositions(), 15000);
    return () => clearInterval(intervalId);
  }, []);

  const value = { lastUpdate, vehicles };
  return <context.Provider value={value}>{props.children}</context.Provider>;
}
