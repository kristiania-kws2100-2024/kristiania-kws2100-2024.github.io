import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getKommuneNavn, KommuneProperties } from "./kommune";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature, MapBrowserEvent } from "ol";
import { MapContext } from "../map/mapContext";

export function ToggleKommuneCheckbox({
  setKommune,
}: {
  setKommune: Dispatch<SetStateAction<KommuneProperties | undefined>>;
}) {
  const [showKommuner, setShowKommuner] = useState(false);
  const [clickedFeatures, setClickedFeatures] = useState<Feature[]>([]);
  const dialogRef = useRef() as MutableRefObject<HTMLDialogElement>;

  const kommuneLayer = useMemo(() => {
    return new VectorLayer({
      className: "kommuner",
      source: new VectorSource({
        url: "/kommuner.json",
        format: new GeoJSON(),
      }),
    });
  }, []);

  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    const featuresAtCoordinate = kommuneLayer
      .getSource()
      ?.getFeaturesAtCoordinate(e.coordinate);
    const kommune = (
      featuresAtCoordinate
        ? featuresAtCoordinate[0]?.getProperties()
        : undefined
    ) as KommuneProperties | undefined;
    setKommune((old) =>
      old?.kommunenummer != kommune?.kommunenummer ? kommune : old,
    );
  }

  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    const featuresAtCoordinate = kommuneLayer
      .getSource()
      ?.getFeaturesAtCoordinate(e.coordinate);
    setClickedFeatures(featuresAtCoordinate || []);
    dialogRef.current.showModal();
  }

  const { setLayers, map } = useContext(MapContext);
  useEffect(() => {
    if (showKommuner) {
      setLayers((old) => [...old, kommuneLayer]);
      map.on("pointermove", handlePointerMove);
      map.on("click", handleClick);
    }
    return () => {
      map.un("pointermove", handlePointerMove);
      map.un("click", handleClick);
      setLayers((old) => old.filter((l) => l !== kommuneLayer));
      setKommune(undefined);
    };
  }, [showKommuner]);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={showKommuner}
          onChange={(e) => setShowKommuner(e.target.checked)}
        />
        <span>{showKommuner ? "Hide" : "Show"} kommuner</span>
      </label>
      <dialog ref={dialogRef}>
        <h2>Clicked kommuner</h2>
        {clickedFeatures
          .map((f) => f.getProperties() as KommuneProperties)
          .map((k) => (
            <div key={k.kommunenummer}>{getKommuneNavn(k)}</div>
          ))}
        <div>
          <button onClick={() => dialogRef.current.close()}>Close</button>
        </div>
      </dialog>
    </div>
  );
}
