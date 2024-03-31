import {
  useVehiclePositions,
  VehiclePosition,
} from "../vehicles/vehiclePositionsContext";
import { useMemo } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";

function style(feature: FeatureLike) {
  const vehicle = feature.getProperties() as VehiclePosition;
  const time = new Date(vehicle.lastMove * 1000).toTimeString().split(" ")[0];
  return [
    new Style({
      image: new Circle({
        radius: 4,
        fill: new Fill({ color: "red" }),
      }),
    }),
    new Style({
      text: new Text({
        text: vehicle.routeId,
        stroke: new Stroke({ color: "white" }),
        fill: new Fill({ color: "white" }),
        font: "13px sans-serif",
        offsetY: -10,
      }),
    }),
    new Style({
      text: new Text({
        text: `${vehicle.history.length} updates (${time})`,
        stroke: new Stroke({ color: "white" }),
        fill: new Fill({ color: "white" }),
        offsetY: 10,
      }),
    }),
  ];
}

export function useVehicleLayer() {
  const { vehicles } = useVehiclePositions();
  const features = useMemo(() => {
    const fifteenMinutesAgo = new Date().getTime() / 1000 - 15 * 60;
    return vehicles
      .filter((v) => v.lastMove > fifteenMinutesAgo)
      .map(
        (v) =>
          new Feature({
            geometry: new Point(v.history[v.history.length - 1].coordinates),
            ...v,
          }),
      );
  }, [vehicles]);

  return useMemo(
    () => new VectorLayer({ source: new VectorSource({ features }), style }),
    [features],
  );
}
