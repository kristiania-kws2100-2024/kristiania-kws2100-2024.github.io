import { useEffect, useMemo } from "react";
import VectorSource from "ol/source/Vector";
import { Point } from "ol/geom";
import { Feature } from "ol";
import {
  fetchVehicleFeatures,
  VehicleProperties,
} from "./vehicleStateProvider";

type VehicleFeature = Feature<Point> & {
  getProperties(): VehicleProperties;
};

export function useVehicleVectorSource(): VectorSource<VehicleFeature> {
  const vectorSource = useMemo(() => new VectorSource<VehicleFeature>(), []);

  async function updateVehiclePositions() {
    const vehicles = await fetchVehicleFeatures();

    for (const vehicle of vehicles) {
      const { id, timestamp } = vehicle;
      const existingFeature = vectorSource.get(id);
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
        vectorSource.addFeature(newFeature);
      }
    }
  }

  useEffect(() => {
    updateVehiclePositions().then();
    const interval = setInterval(() => updateVehiclePositions(), 15000);
    return () => clearInterval(interval);
  }, []);

  return vectorSource;
}
