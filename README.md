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

### Lecture 3: Interacting with the polygon elements

[![Lecture 3 code](https://img.shields.io/badge/Lecture_3-lecture_code-blue)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/lecture/03)
[![Lecture 3 reference](https://img.shields.io/badge/Lecture_3-reference_code-blue)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/reference/03)
[![Lecture 3 exercise](https://img.shields.io/badge/Lecture_3-exercise-pink)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/exercise/03)

In this lecture, we will make sure that the user can interact with kommuner:

- Clicking a feature on the map should bring up an overlay for the user

### Lecture 4: Vector layers as data

[![Lecture 4 code](https://img.shields.io/badge/Lecture_4-lecture_code-blue)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/lecture/04)
[![Lecture 4 reference](https://img.shields.io/badge/Lecture_4-reference_code-blue)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/reference/04)
[![Lecture 4 exercise](https://img.shields.io/badge/Lecture_4-exercise-pink)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/exercise/04)

In this lecture, we will continue out exploration of vector layers. We will start with an "empty" map and add a [polygon feature layer](https://www.eriksmistad.no/norges-fylker-og-kommuner-i-geojson-format/) with an aside that stays in sync with the visible object on the map. We will then add more feature layers from [international](https://github.com/datasets/geo-countries) and [Norwegian](https://kart.dsb.no/) sources.

- Starting point: Empty map
- Add kommune layer with checkbox
- Add kommune aside with list of kommune
- Understanding GeoJSON properties
- Limit kommune aside to current view
- Add fylker (why are polygons `number[][][]`)
- Highlight active features in map
- Add layers with countries and stations (points)


### Lecture 5: Point vector layers

We will draw points on the map from a vector source and allow the user to interact with them. We will explore using images to represent data, clustering features together and custom drawing of point features using a canvas.

- Rendering functions
- Rendering text for a point
- Clustering points together
- Finding clicked point features
- Features in multiple layers

### Lecture 6: Tile layers and map projections

**"Damn you, Gerhard!"**

We will change the background layers in our map to display aerial photos and change the map projection to polar projection

### Lecture 7: Assigment: Deployment of simple map applications

### Lecture 8: Query property data

Using the [Norwegian Land Register](https://kartkatalog.geonorge.no/metadata/matrikkelen-eiendomskart-teig/74340c24-1c8a-4454-b813-bfe498e80f16), we will develop functionality to show properties close to the users location on a map

In this manner, we will start exploring the PostGIS geographical database extension for Postgresql.

### Lecture 9: Importing road data

Using Elveg, [the Norwegian Road Network](https://kartkatalog.geonorge.no/metadata/elveg-20/77944f7e-3d75-4f6d-ae04-c528cc72e8f6), we will import a dataset into PostGIS to query it.

## Lecture 10: Vector tile layers

Highlight: dark mode styling of the background map.

### Lecture 11: Drawing on the map 

### Lecture 12: Getting ready for the exam

## Reference material


### Manual creation to avoid lots of code

This is an alternative to running `npm create vite@latest` and then removing all the code you don't need.

1. `echo {} > package.json` (creates a package.json-file with only the text `{}`)
   - ⚠️ If you are on Windows and using Powershell, this will create a totally empty file, which will not work. Use cmd OR create a `package.json` file manually OR just skip this step if you know there is no `package.json` file in a directory above your project directory
3. `npm install --save-dev vite typescript prettier`
4. `npm install react react-dom`
5. `npm pkg set scripts.dev=vite`
   <details>

   ```shell
   echo {} > package.json
   npm install --save-dev vite typescript prettier
   npm install react react-dom
   npm pkg set scripts.dev=vite
   ```
   
   </details>
6. Create `index.html`:
   ```html
   <body>
   <div id="root"></div>
   </body>
   <script src="src/main.tsx" type="module"></script>
   ```
7. Create `src/main.tsx`:
   ```tsx
   import React from "react";
   import ReactDOM from "react-dom/client";
   const root = ReactDOM.createRoot(document.getElementById("root")!);
   root.render(<h1>Hello React</h1>);
   ```
8. Run `npm run dev` to start developing

### Building with check of Typescript and formatting

Set up:
```shell
npm pkg set scripts.build="npm run check && vite build"
npm pkg set scripts.check="prettier --check . && tsc --noEmit"
```

Clean up:

```shell
npx prettier --write .
npx tsc --init --jsx react
npm install --save-dev @types/react @types/react-dom
```

### Set up GitHub Actions to deploy to GitHub pages

You can either start with a template by clicking on GitHub Actions on your repository on github.com or write you workflow from scratch

#### `.github/workflows/publish.yaml`

```yaml
on:
  push:
    branches:
      - main

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      pages: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18.x
          cache: "npm"
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      - uses: actions/deploy-pages@v4
        id: deployment
```

This will publish your project as `https://<your username>.github.io/<repository name>`. By default, Vite expects index.html to fetch JavaScript from the server root. In order to fetch content from `/<repository name>`, you need the following `vite.config.js`:

```javascript
// vite.config.js
export default {
 base: "/<your repo name>"
}
```

#### Install husky

Husky helps prevent you from checking in bad code:

1. `npm install --save-dev husky`
2. `npm pkg set scripts.prepare="husky install"`
3. `npm run prepare`
4. `npx husky add .husky/pre-push "npm run check"`


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


