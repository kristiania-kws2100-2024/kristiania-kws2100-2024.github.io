import React, { MutableRefObject, useRef, useState } from "react";
import { useKommuneLayer } from "./useKommuneLayer";
import { Feature } from "ol";
import { KommuneProperties } from "./kommuneProperties";

export function KommuneLayerCheckbox() {
  const [show, setShow] = useState(false);
  const dialogRef = useRef() as MutableRefObject<HTMLDialogElement>;
  const [features, setFeatures] = useState<Feature[]>([]);
  function handleClick(features: Feature[]) {
    setFeatures(features);
    dialogRef.current.showModal();
  }
  useKommuneLayer(show, handleClick);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={show}
          onChange={(e) => setShow(e.target.checked)}
        />
        {show ? "Hide" : "Show"} kommuner
      </label>
      <dialog ref={dialogRef}>
        <h1>Clicked kommune</h1>
        {features
          .map((f) => f.getProperties() as KommuneProperties)
          .map((p) => p.navn.find((n) => n.sprak === "nor")!.navn)
          .map((kommunenavn) => (
            <div key={kommunenavn}>{kommunenavn}</div>
          ))}
        <div>
          <button onClick={() => dialogRef.current.close()}>Close</button>
        </div>
      </dialog>
    </div>
  );
}
