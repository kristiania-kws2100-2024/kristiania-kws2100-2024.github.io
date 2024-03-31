import React, {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FeedMessage, VehiclePosition } from "../../generated/gtfs-realtime";
import VectorSource from "ol/source/Vector";
import { LineString, Point } from "ol/geom";
import { Feature } from "ol";
import { sortBy } from "../lib/sortBy";

export function useVehicles(): {
  lastUpdate: Date;
  vehicles: VehiclePropertiesWithHistory[];
  vehicleSource: VectorSource<VehicleFeature>;
  vehicleTrackSource: VectorSource<VehicleTrackFeature>;
} {
  return useContext(VehicleStateContext);
}

const VehicleStateContext = React.createContext({
  lastUpdate: new Date(0),
  vehicles: [] as VehiclePropertiesWithHistory[],
  vehicleSource: new VectorSource<VehicleFeature>(),
  vehicleTrackSource: new VectorSource<VehicleTrackFeature>(),
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

type VehicleTrackFeature = Feature<LineString> & {
  getProperties(): VehicleProperties;
};

export interface VehiclePropertiesWithHistory extends VehicleProperties {
  lastUpdate: Date;
  history: { timestamp: Date; coordinates: number[] }[];
}

type VehicleFeatureWithHistory = VehicleFeature & {
  getProperties(): VehiclePropertiesWithHistory;
};

function toVehicleFeature(vehicle: VehicleProperties) {
  const newFeature = new Feature({
    ...vehicle,
    geometry: new Point(vehicle.geometry.coordinates),
  }) as VehicleFeature;
  newFeature.setId(vehicle.id);
  return newFeature;
}

function toVehicleTrackFeature(vehicle: VehiclePropertiesWithHistory) {
  const newFeature = new Feature({
    ...vehicle,
    geometry: new LineString(
      vehicle.history
        .toSorted(sortBy((c) => new Date(c.timestamp).getTime()))
        .map((c) => c.coordinates),
    ),
  }) as VehicleTrackFeature;
  newFeature.setId(vehicle.id);
  return newFeature;
}

function useVehicleData(): {
  lastUpdate: Date;
  vehicles: VehiclePropertiesWithHistory[];
  vehicleSource: VectorSource<VehicleFeature>;
  vehicleTrackSource: VectorSource<VehicleTrackFeature>;
} {
  const [lastUpdate, setLastUpdate] = useState(new Date(0));
  const [vehicles, setVehicles] = useState<
    Record<string, VehiclePropertiesWithHistory>
  >(() => JSON.parse(localStorage.getItem("vehicles") || "{}"));
  const vehicleSource = useMemo(() => new VectorSource<VehicleFeature>(), []);
  const vehicleTrackSource = useMemo(
    () => new VectorSource<VehicleTrackFeature>(),
    [],
  );

  async function updateVehicles() {
    const features = await fetchVehicleFeatures();
    setLastUpdate(new Date());
    setVehicles((old) => {
      const updates: Record<string, VehiclePropertiesWithHistory> = {};
      for (const feature of features) {
        console.log("feature");
        const {
          id,
          timestamp,
          geometry: { coordinates },
        } = feature;
        const point = { timestamp, coordinates };
        const oldFeature = old[id];
        if (!oldFeature) {
          updates[id] = { ...feature, history: [point], lastUpdate: timestamp };
          vehicleSource.addFeature(toVehicleFeature(updates[id]));
          vehicleTrackSource.addFeature(toVehicleTrackFeature(updates[id]));
        } else if (oldFeature.timestamp < timestamp) {
          const latestUpdate = oldFeature.history.find(
            (f) => f.timestamp === lastUpdate,
          )!;
          if (
            latestUpdate?.coordinates[0].toFixed(2) ===
              coordinates[0].toFixed(2) &&
            latestUpdate?.coordinates[1].toFixed(2) ===
              coordinates[1].toFixed(2)
          ) {
            updates[id] = {
              ...feature,
              lastUpdate: oldFeature.lastUpdate,
              history: [...oldFeature.history, point],
            };
            vehicleSource.addFeature(toVehicleFeature(updates[id]));
          } else {
            updates[id] = {
              ...feature,
              history: [...oldFeature.history, point],
              lastUpdate: timestamp,
            };
            vehicleSource.addFeature(toVehicleFeature(updates[id]));
          }
        } else if (!vehicleSource.get(id)) {
          vehicleSource.addFeature(toVehicleFeature(oldFeature));
        }
      }
      return {
        ...old,
        ...updates,
      };
    });
  }

  useEffect(() => {
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    updateVehicles().then();
    const interval = setInterval(() => updateVehicles(), 15000);
    return () => clearInterval(interval);
  }, []);

  return {
    lastUpdate,
    vehicleSource,
    vehicleTrackSource,
    vehicles: Object.values(vehicles),
  };
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
