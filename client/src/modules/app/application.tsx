import React, { MutableRefObject, useEffect, useRef, useState } from "react";

import "./application.css";
import { useGeographic } from "ol/proj";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

useGeographic();

const map = new Map({
  view: new View({ center: [11, 60], zoom: 10 }),
  layers: [
    new TileLayer({ source: new OSM() }),
    new VectorLayer({
      source: new VectorSource({
        url: "/api/kommuner",
        format: new GeoJSON(),
      }),
    }),
    new VectorLayer({
      source: new VectorSource({
        strategy: (extent, resolution) =>
          resolution < 0.00005 ? [extent] : [],
        url: (extent, resolution, projection) =>
          `/api/eiendommer?bbox=${JSON.stringify(
            extent,
          )}&resolution=${resolution}`,
        format: new GeoJSON(),
      }),
    }),
  ],
});

interface ProfileDto {
  username: string;
}

function ZoomToMeLink() {
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition((res) => {
      const { latitude, longitude } = res.coords;
      map.getView().animate({ center: [longitude, latitude], zoom: 17 });
    });
  }
  return (
    <a href={"#"} onClick={handleClick}>
      Zoom to me
    </a>
  );
}

export function Application() {
  async function fetchProfile() {
    const res = await fetch("/api/profile");
    if (!res.ok) {
      throw Error(res.statusText);
    }
    setProfile(await res.json());
  }

  const [profile, setProfile] = useState<ProfileDto>();
  useEffect(() => {
    fetchProfile();
  }, []);
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);

  return (
    <>
      <header>
        <h1>My map application</h1>
      </header>
      <nav>
        <ZoomToMeLink />
        <div style={{ flex: 1 }}></div>
        {profile && <div>{profile.username}</div>}
      </nav>
      <main>
        <div className={"map"} ref={mapRef} />
      </main>
    </>
  );
}
