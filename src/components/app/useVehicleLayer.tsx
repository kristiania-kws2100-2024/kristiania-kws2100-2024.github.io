import { useVehicles } from "./useVehicles";
import { useMemo } from "react";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { LineString, Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";

export function useVehicleLayer() {
  const vehicles = useVehicles();
  const vehicleSource = useMemo(() => {
    return new VectorSource({
      features: vehicles.map(
        (v) => new Feature(new Point(v.position.coordinate)),
      ),
    });
  }, [vehicles]);
  const vehicleLayer = useMemo(
    () => new VectorLayer({ source: vehicleSource }),
    [vehicleSource],
  );

  const vehicleTrailLayer = new VectorLayer({
    source: new VectorSource({
      features: vehicles
        .filter((v) => v.history.length >= 2)
        .map(
          (v) =>
            new Feature(new LineString(v.history.map((p) => p.coordinate))),
        ),
    }),
  });
  return { vehicleLayer, vehicleTrailLayer };
}
