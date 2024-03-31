import { FeedEntity, FeedMessage } from "../../../generated/gtfs-realtime";
import React, { ReactNode, useContext, useEffect, useState } from "react";

const context = React.createContext({
  lastSnapshot: [] as FeedEntity[],
  vehicleHistory: {} as Record<string, FeedEntity[]>,
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

  async function updateVehiclePositions() {
    const feedMessage = await fetchVehiclePositions();
    setLastUpdate(new Date());
    setVehiclePositions(feedMessage);
    setVehicleHistory((old) => {
      return Object.fromEntries(
        feedMessage.entity.map((e) => [e.id, [e, ...(old[e.id] || [])]]),
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
  };
  return <context.Provider value={value}>{props.children}</context.Provider>;
}
