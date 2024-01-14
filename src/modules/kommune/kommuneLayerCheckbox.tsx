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

interface KommuneProperties {
  kommunenummer: string;
}

type KommuneFeature = Feature & {
  getProperties(): KommuneProperties;
};

export function KommuneLayerCheckbox({
  map,
  setLayers,
}: {
  map: Map;
  setLayers: Dispatch<SetStateAction<Layer[]>>;
}) {
  const [checked, setChecked] = useState(false);
  const [clickedKommune, setClickedKommune] = useState<
    KommuneFeature | undefined
  >();

  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    const clickedKommuner = kommuneLayer
      .getSource()
      ?.getFeaturesAtCoordinate(e.coordinate);

    setClickedKommune(
      clickedKommuner?.length
        ? (clickedKommuner[0] as KommuneFeature)
        : undefined,
    );
  }

  useEffect(() => {
    console.log(clickedKommune?.getProperties()?.kommunenummer);
  }, [clickedKommune]);

  const kommuneLayer = useMemo(() => {
    return new VectorLayer({
      source: new VectorSource({
        url: "/kommuner.json",
        format: new GeoJSON(),
      }),
    });
  }, []);
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
          type={"checkbox"}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        {checked ? "Hide" : "Show"} kommuner
      </label>
    </div>
  );
}
