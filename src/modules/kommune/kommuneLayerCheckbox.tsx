import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Layer } from "ol/layer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature, Map, MapBrowserEvent } from "ol";

type KommuneNavn = {
  sprak: "nor" | "fkv" | "sma" | "sme" | "smj";
  navn: string;
};

interface KommuneProperties {
  kommunenummer: string;
  navn: KommuneNavn[];
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
  const dialogRef = useRef() as MutableRefObject<HTMLDialogElement>;
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
    if (clickedKommune) {
      dialogRef.current.showModal();
    }
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
      <dialog ref={dialogRef}>
        <h2>Valgt kommune</h2>
        <div>
          {
            clickedKommune
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
