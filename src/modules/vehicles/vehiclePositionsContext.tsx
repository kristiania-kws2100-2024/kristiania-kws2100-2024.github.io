import { FeedEntity, FeedMessage } from "../../../generated/gtfs-realtime";
import React, { ReactNode, useContext, useEffect, useState } from "react";

const context = React.createContext({
  vehicles: [] as FeedEntity[],
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
  const [vehiclePositions, setVehiclePositions] = useState<
    FeedMessage | undefined
  >();
  useEffect(() => {
    fetchVehiclePositions().then(setVehiclePositions);
  }, []);
  const value = {
    vehicles: vehiclePositions?.entity || [],
  };
  return <context.Provider value={value}>{props.children}</context.Provider>;
}
