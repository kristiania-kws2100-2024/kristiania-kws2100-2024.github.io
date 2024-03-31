import { useEffect, useState } from "react";
import {
  fetchVehicleFeatures,
  VehicleProperties,
} from "./vehicleStateProvider";

export function useVehicles(): VehicleProperties[] {
  const [vehicles, setVehicles] = useState<Record<string, VehicleProperties>>(
    {},
  );

  async function updateVehicles() {
    const features = await fetchVehicleFeatures();
    setVehicles((old) => {
      const updates: Record<string, VehicleProperties> = {};
      for (const feature of features) {
        const { id, timestamp } = feature;
        if (!old[id] || old[id].timestamp < timestamp) {
          updates[id] = feature;
        }
      }
      return {
        ...old,
        ...updates,
      };
    });
  }

  useEffect(() => {
    updateVehicles().then();
    const interval = setInterval(() => updateVehicles(), 15000);
    return () => clearInterval(interval);
  }, []);

  return Object.values(vehicles);
}
