import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Layer } from "ol/layer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Map, MapBrowserEvent } from "ol";

interface KommuneProperties {
  kommunenummer: string;
  navn: { sprak: string; navn: string }[];
}

export function KommuneLayerCheckbox({
  setLayers,
  map,
}: {
  setLayers: Dispatch<SetStateAction<Layer[]>>;
  map: Map;
}) {
  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    const features = kommuneLayer
      .getSource()
      ?.getFeaturesAtCoordinate(e.coordinate);
    const firstFeature = features?.length ? features[0] : undefined;
    if (firstFeature) {
      const kommuneProperties =
        firstFeature.getProperties() as KommuneProperties;
      alert(kommuneProperties.navn.find((n) => n.sprak === "nor")!.navn);
    }
  }
  const kommuneLayer = useMemo(
    () =>
      new VectorLayer({
        source: new VectorSource({
          url: "/kommuner.json",
          format: new GeoJSON(),
        }),
      }),
    [],
  );
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, kommuneLayer]);
      map.on("click", handleClick);
    } else {
      setLayers((old) => old.filter((l) => l !== kommuneLayer));
    }
  }, [checked]);

  return (
    <div>
      <label>
        <input
          type={"checkbox"}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        {checked ? "Hide" : "Show"} kommuner
      </label>
    </div>
  );
}
