import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getKommuneNavn, KommuneProperties } from "./kommune";
import { Feature, MapBrowserEvent } from "ol";
import { MapContext } from "../map/mapContext";
import { useKommuneLayer } from "./useKommuneLayer";

export function ToggleKommuneCheckbox({
  setKommune,
}: {
  setKommune: Dispatch<SetStateAction<KommuneProperties | undefined>>;
}) {
  const [showKommuner, setShowKommuner] = useState(false);
  const [clickedFeatures, setClickedFeatures] = useState<Feature[]>([]);
  const dialogRef = useRef() as MutableRefObject<HTMLDialogElement>;

  function handleClick(features: Feature[]) {
    setClickedFeatures(features);
    dialogRef.current.showModal();
  }

  const kommuneLayer = useKommuneLayer(showKommuner, handleClick);

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

  const { map } = useContext(MapContext);
  useEffect(() => {
    if (showKommuner) {
      map.on("pointermove", handlePointerMove);
    }
    return () => {
      map.un("pointermove", handlePointerMove);
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
