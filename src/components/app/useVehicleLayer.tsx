import { useVehicles } from "./useVehicles";
import { useMemo } from "react";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";

export function useVehicleLayer() {
  const vehicles = useVehicles();
  const vehicleSource = useMemo(() => {
    return new VectorSource({
      features: vehicles.map((v) => new Feature(new Point(v.coordinate))),
    });
  }, [vehicles]);
  return useMemo(
    () => new VectorLayer({ source: vehicleSource }),
    [vehicleSource],
  );
}
