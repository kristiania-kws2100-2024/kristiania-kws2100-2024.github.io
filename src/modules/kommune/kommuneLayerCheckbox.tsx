import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Layer } from "ol/layer";
import { Map } from "ol";
import { KommuneNavn } from "./kommune";
import { useKommuneLayer } from "./useKommuneLayer";

export function KommuneLayerCheckbox({
  map,
  setLayers,
}: {
  map: Map;
  setLayers: Dispatch<SetStateAction<Layer[]>>;
}) {
  const dialogRef = useRef() as MutableRefObject<HTMLDialogElement>;
  const [checked, setChecked] = useState(false);
  const { layer, clickedFeature } = useKommuneLayer(checked, map);

  useEffect(() => {
    if (clickedFeature) {
      dialogRef.current.showModal();
    }
  }, [clickedFeature]);

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, layer]);
    }
    return () => {
      setLayers((old) => old.filter((l) => l !== layer));
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
      <dialog ref={dialogRef}>
        <h2>Valgt kommune</h2>
        <div>
          {
            clickedFeature
              ?.getProperties()
              ?.navn?.find((n: KommuneNavn) => n.sprak === "nor")?.navn
          }
        </div>
        <div>
          <button onClick={() => dialogRef.current.close()}>Close</button>
        </div>
      </dialog>
    </div>
  );
}
