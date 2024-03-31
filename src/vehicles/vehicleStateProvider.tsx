import React, {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FeedMessage, VehiclePosition } from "../../generated/gtfs-realtime";
import VectorSource from "ol/source/Vector";
import { Point } from "ol/geom";
import { Feature } from "ol";

export function useVehicles(): {
  vehicles: VehicleProperties[];
  vehicleSource: VectorSource<VehicleFeature>;
} {
  return useContext(VehicleStateContext);
}

const VehicleStateContext = React.createContext({
  vehicles: [] as VehicleProperties[],
  vehicleSource: new VectorSource<VehicleFeature>(),
});

export function VehicleStateProvider(props: { children: ReactNode }) {
  const value = useVehicleData();
  return (
    <VehicleStateContext.Provider value={value}>
      {props.children}
    </VehicleStateContext.Provider>
  );
}

type VehicleFeature = Feature<Point> & {
  getProperties(): VehicleProperties;
};

function useVehicleData(): {
  vehicles: VehicleProperties[];
  vehicleSource: VectorSource<VehicleFeature>;
} {
  const [vehicles, setVehicles] = useState<Record<string, VehicleProperties>>(
    {},
  );
  const vehicleSource = useMemo(() => new VectorSource<VehicleFeature>(), []);

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
    for (const vehicle of features) {
      const { id, timestamp } = vehicle;
      const existingFeature = vehicleSource.get(id);
      if (
        !existingFeature ||
        existingFeature.getProperties().timestamp < timestamp
      ) {
        const geometry = new Point(vehicle.geometry.coordinates);
        const newFeature = new Feature({
          ...vehicle,
          geometry,
        }) as VehicleFeature;
        newFeature.setId(id);
        vehicleSource.addFeature(newFeature);
      }
    }
  }

  useEffect(() => {
    updateVehicles().then();
    const interval = setInterval(() => updateVehicles(), 15000);
    return () => clearInterval(interval);
  }, []);

  return { vehicleSource, vehicles: Object.values(vehicles) };
}

export interface VehicleProperties {
  geometry: {
    type: "Point";
    coordinates: number[];
  };
  id: string;
  timestamp: Date;
  routeId: string;
  bearing?: number;
  rawData: VehiclePosition;
}

const VEHICLE_POSITIONS_URL =
  "https://api.entur.io/realtime/v1/gtfs-rt/vehicle-positions";

export async function fetchVehicleFeed() {
  const res = await fetch(VEHICLE_POSITIONS_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${VEHICLE_POSITIONS_URL}: ${res}`);
  }
  return FeedMessage.decode(new Uint8Array(await res.arrayBuffer()));
}

export async function fetchVehicleFeatures() {
  const feedMessage = await fetchVehicleFeed();
  const features: VehicleProperties[] = [];
  for (const { id, vehicle } of feedMessage.entity) {
    if (!vehicle || !vehicle.position || !vehicle.timestamp || !vehicle.trip)
      continue;
    const { position } = vehicle;
    const { longitude, latitude, bearing } = position;
    const routeId = vehicle.trip.routeId!;
    const timestamp = new Date(vehicle.timestamp * 1000);
    const rawData = vehicle;
    const geometry = {
      type: "Point" as const,
      coordinates: [longitude, latitude],
    };
    features.push({ geometry, id, routeId, bearing, rawData, timestamp });
  }
  return features;
}
