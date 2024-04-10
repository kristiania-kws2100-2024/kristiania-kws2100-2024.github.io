import { useVehicles } from "./useVehicles";
import { useMemo } from "react";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { LineString, Point } from "ol/geom";
import { Circle, Fill, Stroke, Text } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import { Style } from "ol/style";
import { FeatureLike } from "ol/Feature";

function vehicleStyle(feature: FeatureLike, resolution: number) {
  if (resolution < 200) {
    return new Style({
      image: new Circle({
        radius: 2,
        stroke: new Stroke({ color: "white" }),
      }),
      text: new Text({
        text: feature.getProperties().routeId,
        fill: new Fill({ color: "white" }),
        stroke: new Stroke({ color: "white" }),
      }),
    });
  } else {
    return new Style({
      image: new Circle({
        radius: 2,
        stroke: new Stroke({ color: "white" }),
      }),
    });
  }
}

export function useVehicleLayer() {
  const vehicles = useVehicles();
  const vehicleSource = useMemo(() => {
    return new VectorSource({
      features: vehicles.map(
        ({ position: { coordinate }, routeId }) =>
          new Feature({ geometry: new Point(coordinate), routeId }),
      ),
    });
  }, [vehicles]);
  const vehicleLayer = useMemo(
    () =>
      new VectorLayer({
        source: vehicleSource,
        style: vehicleStyle,
      }),
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
