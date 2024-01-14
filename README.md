# KWS2100 Geographic Information Web Systems

[![Running website](https://img.shields.io/badge/Course-website-green)](https://kristiania-kws2100-2024.github.io/)

Welcome to this course in Geographic Information Systems (GIS) for the web. In this course, we will use popular and powerfull open-source software to explore geographic information systems on the web. The course will use [OpenLayers](https://openlayers.org/) as a web framework for information systems and [PostGIS](https://postgis.net/) as a geographical information database. We will build web applications with the React framework and use Express to create APIs on top of PostGIS.

## Understanding the course

In this course, we expect you to create working web applications with geographic functionality. During the lectures, you will see live coding of how such applications may be constructed and the relevant topics will be explained along the way.

The lectures will be recorded and the recordings will be available to students in Panopto in Canvas.

## Lectures

### Lecture 1: A tour of OpenLayers

[![Lecture 1 code](https://img.shields.io/badge/Lecture_1-lecture_code-blue)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/lecture/01)
[![Lecture 1 reference](https://img.shields.io/badge/Lecture_1-reference_code-blue)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/reference/01)
[![Lecture 1 exercise](https://img.shields.io/badge/Lecture_1-exercise-pink)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/exercise/01)

We will create a React application that will display a simple map with a background layer from [Open Street Map](https://www.openstreetmap.org/) and a [vector layer](https://www.eriksmistad.no/norges-fylker-og-kommuner-i-geojson-format/).

### Lecture 2: Publishing maps with interaction

[![Lecture 2 code](https://img.shields.io/badge/Lecture_2-lecture_code-blue)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/lecture/02)
[![Lecture 2 reference](https://img.shields.io/badge/Lecture_2-reference_code-blue)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/reference/02)
[![Lecture 2 exercise](https://img.shields.io/badge/Lecture_2-exercise-pink)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/exercise/02)

We will publish a basic Vite application to GitHub pages and then add a map where you can click on features to get more information

### Lecture 3: Vector source

Will will add more interaction to the polygon features on the map, including hovering over features and listing features currently in the view.

### Lecture 4: Interacting with point features

### Lecture 5: Tile layers and map projections

**"Damn you, Gerhard!"**

We will change the background layers in our map to display aerial photos and change the map projection to polar projection

### Lecture 6: Query property data

Using the [Norwegian Land Register](https://kartkatalog.geonorge.no/metadata/matrikkelen-eiendomskart-teig/74340c24-1c8a-4454-b813-bfe498e80f16), we will develop functionality to show properties close to the users location on a map

### Lecture 7: Assigment: Deployment of simple map applications

### Lecture 8: Importing road data

Using Elveg, [the Norwegian Road Network](https://kartkatalog.geonorge.no/metadata/elveg-20/77944f7e-3d75-4f6d-ae04-c528cc72e8f6), we will import a dataset into PostGIS to query it.

### Lecture 10: Vector layers and styles

### Lecture 11: Getting ready for the exam

## Reference material

### Creating a basic React application with Vite and TypeScript

`npm create vite@latest -- --template react-ts`

### Manual creation to avoid lots of code

1. `echo {} > package.json` (creates an empty package.json-file)
2. `npm install --save-dev vite typescript prettier`
3. `npm install react react-dom`
4. `npm pkg set scripts.dev=vite`
5. Create `index.html`:
   ```html
   <body>
   <div id="root"></div>
   </body>
   <script src="src/main.tsx" type="module"></script>
   ```
6. Create `src/main.tsx`:
   ```tsx
   import React from "react";
   import ReactDOM from "react-dom/client";
   const root = ReactDOM.createRoot(document.getElementById("root")!);
   root.render(<h1>Hello React</h1>);
   ```
7. Run `npm run dev` to start developing

### Setting up TypeScript properly

1. After running `npm install -D typescript` (above), run `npx tsc --init`, which creates `tsconfig.json`
2. You will need to also add React type definitions: `npm install --save-dev @types/react @types/react-dom`
3. In `tsconfig.json` you will need to configure `"jsx": "react"`


### Creating a OpenLayers map in React

```tsx
// By calling the "useGeographic" function in OpenLayers, we tell that we want coordinates to be in degrees
//  instead of meters, which is the default. Without this `center: [11, 60]` doesn't work on the view
useGeographic();

// Here we create a Map object. Make sure you `import { Map } from "ol"` or otherwise, standard Javascript
//  map data structure will be used
const map = new Map({
  // The map will be centered on 60 degrees latitude and 11 degrees longitude, with a certain zoom level  
  view: new View({ center: [11, 60], zoom: 10 }),
  // images displayed on the map will be from the Open Street Map (OSM) tile layer
  layers: [new TileLayer({source: new OSM()})]
})

// A functional React component
function App() {
  // `useRef` bridges the gap between JavaScript functions that expect DOM objects and React components
  // `as MutableRefObject` is required by TypeScript to avoid us binding the wrong ref to the wrong component  
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

  // When we display the page, we want the OpenLayers map object to target the DOM object refererred to by the
  // map React component 
  useEffect(() => {
    map.setTarget(mapRef.current);
  }, []);

  // This is the location (in React) where we want the map to be displayed
  return (
    <div ref={mapRef}></div>
  )
}
```

### Creating a PostGIS API in Express


