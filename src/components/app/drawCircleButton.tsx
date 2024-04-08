import { DrawingProps } from "./drawingProps";
import React, { useMemo } from "react";
import { Draw } from "ol/interaction";
import VectorSource, { VectorSourceEvent } from "ol/source/Vector";
import { Circle } from "ol/geom";
import { Style, Circle as CircleStyle, Fill, Stroke } from "ol/style";

export function DrawCircleButton({
  source,
  map,
  vehicleSource,
}: DrawingProps & { vehicleSource: VectorSource }) {
  const draw = useMemo(() => new Draw({ source, type: "Circle" }), [source]);

  function handleClick() {
    map.addInteraction(draw);
    source.once("addfeature", handleAddFeature);
  }

  function handleAddFeature(e: VectorSourceEvent) {
    map.removeInteraction(draw);

    const circle = e.feature!.getGeometry() as Circle;
    const center = circle.getCenter();
    const radius = circle.getRadius();

    const features = vehicleSource.getFeaturesInExtent(circle.getExtent());
    console.log({
      center,
      radius,
      features: features.map((f) => f.getProperties().routeId),
    });

    for (const feature of features) {
      feature.setStyle(
        new Style({
          image: new CircleStyle({
            stroke: new Stroke({ color: "red" }),
            radius: 5,
          }),
        }),
      );
    }
  }

  return <button onClick={handleClick}>Draw circle</button>;
}
