import * as React from "react";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { FeedMessage } from "../generated/gtfs-realtime";

const VEHICLE_URL =
  "https://api.entur.io/realtime/v1/gtfs-rt/vehicle-positions";

const root = createRoot(document.getElementById("root")!);

function Application() {
  async function fetchFeed() {
    const res = await fetch(VEHICLE_URL);
    if (!res.ok) {
      throw `Failed to fetch ${res.url}: ${res}`;
    }
    return FeedMessage.decode(new Uint8Array(await res.arrayBuffer()));
  }

  const [feedMessage, setFeedMessage] = useState<FeedMessage | undefined>();
  useEffect(() => {
    fetchFeed().then(setFeedMessage);
  }, []);
  useEffect(() => {
    console.log(feedMessage?.entity.length + " messages");
  }, [feedMessage]);

  return <h1>Hello React and Vite</h1>;
}

root.render(<Application />);
