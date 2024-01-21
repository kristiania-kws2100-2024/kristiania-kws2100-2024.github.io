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
import { Map, MapBrowserEvent, Overlay } from "ol";
import { KommuneFeature } from "./kommuneFeature";

export function KommuneLayerCheckbox({
  setLayers,
  map,
}: {
  setLayers: Dispatch<SetStateAction<Layer[]>>;
  map: Map;
}) {
  const overlayRef = useRef() as MutableRefObject<HTMLDivElement>;
  const [checked, setChecked] = useState(true);
  const [selectedKommune, setSelectedKommune] = useState<
    KommuneFeature | undefined
  >();
  const source = useMemo(
    () =>
      new VectorSource<KommuneFeature>({
        url: "/kommuner.json",
        format: new GeoJSON(),
      }),
    [],
  );
  const overlay = useMemo(() => new Overlay({}), []);
  useEffect(() => {
    map.addOverlay(overlay);
    overlay.setElement(overlayRef.current);
    return () => {
      map.removeOverlay(overlay);
    };
  }, [overlay]);
  const kommuneLayer = useMemo(
    () => new VectorLayer({ source, className: "kommuner" }),
    [source],
  );

  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    const clickedFeature = source.getFeaturesAtCoordinate(
      e.coordinate,
    )[0] as KommuneFeature;
    setSelectedKommune((old) => {
      if (old) {
        overlay.setPosition(undefined);
        return undefined;
      } else if (clickedFeature) {
        overlay.setPosition(e.coordinate);
        return clickedFeature;
      }
    });
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
      <div ref={overlayRef}>
        {selectedKommune && (
          <div className={"selected-kommune"}>
            {
              selectedKommune
                .getProperties()
                .navn.find((n) => n.sprak === "nor")!.navn
            }
          </div>
        )}
      </div>
    </div>
  );
}
