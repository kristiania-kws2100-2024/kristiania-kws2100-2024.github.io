import { FeedMessage, VehiclePosition } from "../../generated/gtfs-realtime";
import { useEffect, useMemo } from "react";
import VectorSource from "ol/source/Vector";
import { Point } from "ol/geom";
import { Feature } from "ol";

const VEHICLE_POSITIONS_URL =
  "https://api.entur.io/realtime/v1/gtfs-rt/vehicle-positions";

export interface VehicleProperties {
  id: string;
  timestamp: Date;
  routeId: string;
  bearing?: number;
  rawData: VehiclePosition;
}

export function useVehicleVectorSource(): VectorSource<Feature<Point>> {
  const vectorSource = useMemo(() => new VectorSource<Feature<Point>>(), []);

  async function fetchVehiclePositions() {
    const res = await fetch(VEHICLE_POSITIONS_URL);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${VEHICLE_POSITIONS_URL}: ${res}`);
    }
    const feedMessage = FeedMessage.decode(
      new Uint8Array(await res.arrayBuffer()),
    );

    for (const { id, vehicle } of feedMessage.entity) {
      if (!vehicle?.position) continue;

      const timestamp = new Date(vehicle.timestamp!);
      const { longitude, latitude, bearing } = vehicle.position;
      const geometry = new Point([longitude, latitude]);

      const existingFeature = vectorSource.get(id);
      if (
        !existingFeature ||
        existingFeature.getProperties().timestamp < timestamp
      ) {
        const properties: VehicleProperties = {
          id,
          routeId: vehicle.trip?.routeId!,
          timestamp,
          rawData: vehicle,
          bearing,
        };
        const newFeature = new Feature({ geometry, ...properties });
        newFeature.setId(id);
        vectorSource.addFeature(newFeature);
      }
    }
  }

  useEffect(() => {
    fetchVehiclePositions().then();
    const interval = setInterval(() => fetchVehiclePositions(), 15000);
    return () => clearInterval(interval);
  }, []);

  return vectorSource;
}
