import { useVehiclePositions } from "../vehicles/vehiclePositionsContext";
import { useMemo } from "react";
import { Feature } from "ol";
import { LineString, Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

export function useVehicleTrailLayer() {
  const { vehicles } = useVehiclePositions();
  const features = useMemo(() => {
    const fifteenMinutesAgo = new Date().getTime() / 1000 - 15 * 60;
    return vehicles
      .filter((v) => v.lastMove > fifteenMinutesAgo)
      .map(
        (v) =>
          new Feature({
            geometry: new LineString(v.history.map((pos) => pos.coordinates)),
            ...v,
          }),
      );
  }, [vehicles]);

  return useMemo(
    () => new VectorLayer({ source: new VectorSource({ features }) }),
    [features],
  );
}
