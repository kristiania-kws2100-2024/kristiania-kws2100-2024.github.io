import React from "react";
import ReactDOM from "react-dom/client";

function Application() {
  return <h1>Hello React</h1>;
}

const root = ReactDOM.createRoot(document.getElementById("app")!);
root.render(<Application />)