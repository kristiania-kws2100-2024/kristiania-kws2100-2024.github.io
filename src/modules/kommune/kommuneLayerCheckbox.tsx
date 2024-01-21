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
import { Feature, Map, MapBrowserEvent } from "ol";
import { Polygon } from "ol/geom";

interface KommuneFeature extends Feature<Polygon> {
  getProperties(): KommuneProperties;
}

interface KommuneProperties {
  kommunenummer: string;
}

export function KommuneLayerCheckbox({
  setLayers,
  map,
}: {
  setLayers: Dispatch<SetStateAction<Layer[]>>;
  map: Map;
}) {
  const [checked, setChecked] = useState(false);
  const source = useMemo(
    () =>
      new VectorSource<KommuneFeature>({
        url: "/kommuner.json",
        format: new GeoJSON(),
      }),
    [],
  );
  const kommuneLayer = useMemo(() => new VectorLayer({ source }), [source]);

  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    const clickedFeature = source.getFeaturesAtCoordinate(
      e.coordinate,
    )[0] as KommuneFeature;
    alert(clickedFeature!.getProperties().kommunenummer);
  }

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, kommuneLayer]);
      map.on("click", handleClick);
    }
    return () => {
      map.un("click", handleClick);
      setLayers((old) => old.filter((l) => l !== kommuneLayer));
    };
  }, [checked]);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        Show kommune
      </label>
    </div>
  );
}
