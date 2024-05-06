import * as React from "react";

import "./application.css";

export function Application() {
  return (
    <>
      <header>
        <h1>OpenLayers demo</h1>
      </header>
      <nav>
        <label>
          <input type={"checkbox"} />
          Show shelters
        </label>
        <label>
          <input type={"checkbox"} />
          Show kommuner
        </label>
        <label>
          Background map:
          <select>
            <option>Open Street Map</option>
            <option>Norge i bilder</option>
          </select>
        </label>
      </nav>
      <div className={"map"}>(I'm a map)</div>
      <footer>Current focus:</footer>
    </>
  );
}
