# KWS2100 Geographic Information Web Systems

[![Running website](https://img.shields.io/badge/Course-website-green)](https://kristiania-kws2100-2024.github.io/)

Welcome to this course in Geographic Information Systems (GIS) for the web. In this course, we will use popular and
powerful open-source software to explore geographic information systems on the web. The course will
use [OpenLayers](https://openlayers.org/) as a web framework for information systems and [PostGIS](https://postgis.net/)
as a geographical information database. We will build web applications with the React framework and use Express to
create APIs on top of PostGIS.

## Understanding the course

In this course, we expect you to create working web applications with geographic functionality. During the lectures, you
will see live coding of how such applications may be constructed and the relevant topics will be explained along the
way.

The lectures will be recorded and the recordings will be available to students in Panopto in Canvas.

## Lectures

### Lecture 1: A tour of OpenLayers

[![Lecture 1 code](https://img.shields.io/badge/Lecture_1-lecture_code-blue)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/lecture/01)
[![Lecture 1 reference](https://img.shields.io/badge/Lecture_1-reference_code-blue)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/reference/01)
[![Lecture 1 exercise](https://img.shields.io/badge/Lecture_1-exercise-pink)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/exercise/01)

We will create a React application that will display a simple map with a background layer
from [Open Street Map](https://www.openstreetmap.org/) and
a [vector layer](https://www.eriksmistad.no/norges-fylker-og-kommuner-i-geojson-format/).

### Lecture 2: Publishing maps with interaction

[![Lecture 2 code](https://img.shields.io/badge/Lecture_2-lecture_code-blue)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/lecture/02)
[![Lecture 2 reference](https://img.shields.io/badge/Lecture_2-reference_code-blue)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/reference/02)
[![Lecture 2 exercise](https://img.shields.io/badge/Lecture_2-exercise-pink)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/exercise/02)

We will publish a basic Vite application to GitHub pages and then add a map where you can click on features to get more
information

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

In this lecture, we will continue out exploration of vector layers. We will start with an "empty" map and add
a [polygon feature layer](https://www.eriksmistad.no/norges-fylker-og-kommuner-i-geojson-format/) with an aside that
stays in sync with the visible object on the map. We will then add more feature layers
from [international](https://github.com/datasets/geo-countries) and [Norwegian](https://kart.dsb.no/) sources.

- Starting point: Empty map
- Add kommune layer with checkbox
- Add kommune aside with list of kommune
- Understanding GeoJSON properties
- Limit kommune aside to current view
- Add fylker (why are polygons `number[][][]`)
- Highlight active features in map
- Add layers with countries and stations (points)

### Lecture 5: Point vector layers

[![Lecture 5 code](https://img.shields.io/badge/Lecture_5-lecture_code-blue)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/lecture/05)
[![Lecture 5 reference](https://img.shields.io/badge/Lecture_5-reference_code-blue)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/reference/05)
[![Lecture 5 exercise](https://img.shields.io/badge/Lecture_5-exercise-pink)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/exercise/05)

We will draw points on the map from a vector source and allow the user to interact with them. We will explore styling
based on feature properties.

- Style functions
- Style text for a point
- Finding hovered point features

### Lecture 6: Tile layers and map projections

[![Lecture 6 code](https://img.shields.io/badge/Lecture_6-lecture_code-blue)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/lecture/06)
[![Lecture 6 reference](https://img.shields.io/badge/Lecture_6-reference_code-blue)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/reference/06)
[![Lecture 6 exercise](https://img.shields.io/badge/Lecture_6-exercise-pink)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/exercise/06)

**"Damn you, Gerhard!"**

We will change the background layers in our map to display aerial photos and change the map projection to polar
projection. In the process, we will learn that the earth is indeed round.

- Restructure the map layers to vary base layer
- Use a few [Stadia maps](https://stadiamaps.com/)
-

Add [aerial photos of Norway](https://kartkatalog.geonorge.no/metadata/norge-i-bilder-wmts-euref89-utm33/072662f8-41c9-4e9a-a55a-343dee0c3f84) ("
Norge i bilder")

-

Add [Norwegian official map](https://kartkatalog.geonorge.no/metadata/norges-grunnkart-cache/860f8b53-1dcf-4a39-87a4-71b3e9125dcb) ("
Norges grunnkart"), introducing some projection strangeness

- Add [Arctic Spacial Data Infrastructure](https://arctic-sdi.org/services/topografic-basemap/) polar map, going all in
  on projections

#### Reference:

- [UTM 32V i Store Norske Leksikon](https://snl.no/UTM)
- [Map Men: Why Every Map is Wrong](https://www.youtube.com/watch?v=jtBV3GgQLg8) (silly, but educational)

### No lecture in week 8

### Lecture 7: TypeScript and React review

[![Lecture 7 code](https://img.shields.io/badge/Lecture_7-lecture_code-blue)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/lecture/07)
[![Lecture 7 reference](https://img.shields.io/badge/Lecture_7-reference_code-blue)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/reference/07)
[![Lecture 7 exercise](https://img.shields.io/badge/Lecture_7-exercise-pink)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/exercise/07)

- [We follow the React getting started guide](https://react.dev/learn)
- We go through essential React concepts: Components
    - Component definitions
    - Component usage
    - Props
    - Event handlers
- We go through essential React [hooks](https://react.dev/reference/react/hooks)
    - useState
    - useEffect
    - useContext
    - useMemo
    - useRef
- TypeScript demonstration
    - string union types
    - interface types
    - return types
    - higher order types

### Lecture 8: Query property data

[![Lecture 8 code](https://img.shields.io/badge/Lecture_8-lecture_code-blue)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/lecture/08)
[![Lecture 8 reference](https://img.shields.io/badge/Lecture_8-reference_code-blue)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/reference/08)
[![Lecture 8 exercise](https://img.shields.io/badge/Lecture_8-exercise-pink)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/exercise/08)

Using the following public datasets, we will explore PostGIS and integrate a database into the OpenLayers front-end.

- [Administrative enheter - kommuner](https://kartkatalog.geonorge.no/metadata/administrative-enheter-kommuner/041f1e6e-bdbc-4091-b48f-8a5990f3cc5b)
- [Statistiske enheter - grunnkretser](https://kartkatalog.geonorge.no/metadata/statistiske-enheter-grunnkretser/51d279f8-e2be-4f5e-9f72-1a53f7535ec1)
- [Matrikkelen - adresse](https://kartkatalog.geonorge.no/metadata/matrikkelen-adresse/f7df7a18-b30f-4745-bd64-d0863812350c)

We will cover:

1. Starting PostGIS with Docker Compose
2. Downloading, importing and processing datasets
3. Exploring geographic functions in the
   database, `ST_Distance`, `ST_Dwithin`, `ST_Contains`, `ST_Transform`, `ST_Simplify` and `ST_AsGeoJSON`
4. Creating geographic APIs with Express
5. Limiting the data displayed in a vector layer based on resolution and view extent

### Lecture 9: Importing road data

[![Lecture 9 code](https://img.shields.io/badge/Lecture_9-lecture_code-blue)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/lecture/09)
[![Lecture 8/9 exercise](https://img.shields.io/badge/Lecture_8-exercise-pink)](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/exercise/08)

We will review the PostGIS database from scratch. We will focus on Grunnkretser in the Norwegian geographical data set
and import, query and visualize these with a GIS API that we construct on Express.

During the exercise, we will slow-code the same. We will start with a slow-paced introduction to Docker and PostGIS so
everybody can keep up.

- [Administrative enheter - kommuner](https://kartkatalog.geonorge.no/metadata/administrative-enheter-kommuner/041f1e6e-bdbc-4091-b48f-8a5990f3cc5b)
- [Statistiske enheter - grunnkretser](https://kartkatalog.geonorge.no/metadata/statistiske-enheter-grunnkretser/51d279f8-e2be-4f5e-9f72-1a53f7535ec1)

## Lecture 10: Vector tile layers

Highlight: dark mode styling of the background map.

### Lecture 11: Drawing on the map

### Lecture 12: Getting ready for the exam

## Reference material

### Manual creation to avoid lots of code

This is an alternative to running `npm create vite@latest` and then removing all the code you don't need.

1. `echo {} > package.json` (creates a package.json-file with only the text `{}`)
    - ⚠️ If you are on Windows and using Powershell, this will create a totally empty file, which will not work. Use cmd
      OR create a `package.json` file manually OR just skip this step if you know there is no `package.json` file in a
      directory above your project directory
2. `npm install --save-dev vite typescript prettier`
3. `npm install react react-dom`
4. `npm pkg set scripts.dev=vite`
   <details>

   ```shell
   echo {} > package.json
   npm install --save-dev vite typescript prettier
   npm install react react-dom
   npm pkg set scripts.dev=vite
   ```

   </details>

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

### Building with check of Typescript and formatting

Set up:

```shell
npm pkg set scripts.build="npm test && vite build"
npm pkg set scripts.test="prettier --check . && tsc --noEmit"
```

Clean up:

```shell
npm install --save-dev @types/react @types/react-dom
npx tsc --init --jsx react
npx prettier --write .
```

#### Install husky

[Husky](https://typicode.github.io/husky/) helps prevent you from checking in bad code:

1. `npm install --save-dev husky`
2. `npx husky init`

Note: By default, Husky creates a file `.husky/pre-commit` which runs `npm test`. If you want to run another script,
just change the contents of the file. If you want it to run before push instead of before commits, rename the file
to `pre-push`

### Set up GitHub Actions to deploy to GitHub pages

You can either start with a template by clicking on GitHub Actions on your repository on GitHub.com or write you
workflow from scratch

#### `.github/workflows/publish.yaml`

```yaml
on:
  push:
    branches:
      - main

jobs:
  publish:
    runs-on: ubuntu-latest

    # Grant GITHUB_TOKEN the permissions required to make a Pages deployment
    permissions:
      id-token: write # to verify the deployment originates from an appropriate
      pages: write # to deploy to Pages
      contents: read # to checkout private repositories
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: "npm"
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      - uses: actions/deploy-pages@v4
        id: deployment
```

This will publish your project as `https://<your username>.github.io/<repository name>`. By default, Vite expects
index.html to fetch JavaScript from the server root. In order to fetch content from `/<repository name>`, you need the
following `vite.config.js`:

```javascript
// vite.config.js
export default {
  base: "/<your repo name>",
};
```

### Creating a OpenLayers map in React

First you need to install the `ol` dependency:

- `npm install ol`

```tsx
import React, { MutableRefObject, useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";

// By calling the "useGeographic" function in OpenLayers, we tell that we want coordinates to be in degrees
//  instead of meters, which is the default. Without this `center: [11, 60]` doesn't work on the view
useGeographic();

// Here we create a Map object. Make sure you `import { Map } from "ol"` or otherwise, standard Javascript
//  map data structure will be used
const map = new Map({
  // The map will be centered on 60 degrees latitude and 11 degrees longitude, with a certain zoom level
  view: new View({ center: [11, 60], zoom: 10 }),
  // images displayed on the map will be from the Open Street Map (OSM) tile layer
  layers: [new TileLayer({ source: new OSM() })],
});

// A functional React component
export function Application() {
  // `useRef` bridges the gap between JavaScript functions that expect DOM objects and React components
  // `as MutableRefObject` is required by TypeScript to avoid us binding the wrong ref to the wrong component
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

  // When we display the page, we want the OpenLayers map object to target the DOM object refererred to by the
  // map React component
  useEffect(() => {
    map.setTarget(mapRef.current);
  }, []);

  // This is the location (in React) where we want the map to be displayed
  return <div ref={mapRef}></div>;
}
```

### Doing a code review on GitHub

Code reviews on GitHub are best done with Pull Requests. This means that you generally want to create a branch that gets
reviewed. For the assignment, this has already been done for you by creating a `feedback` branch. The `main` branch
has a Pull Request **_into_** the `feedback` branch. **_You should not merge this pull request_**

1. Give your reviewers access to your repository under Settings > Collaborators and teams
    - Reviewers need minimum "Reader" access
    - NOTE: You don't need to give the teacher and the TAs access - this happens automatically
2. The reviewer should go to the repository and select Pull requests and select the Feedback Pull request
3. The easiest way to give a review is to go to Files changes and add comments by clicking on lines for files
4. When you're giving a review make sure that you Finish the review or nobody else will see your comments
5. Everyone who has access to the repository will be able to see the comments by looking at the Pull request

If you made the mistake of merging the Feedback branch, it will be a bit more difficult to give a good review, but the
following process works okay:

1. (As above) Give your reviewers access to your repository under Settings > Collaborators and teams
    - Reviewers need minimum "Reader" access
    - NOTE: You don't need to give the teacher and the TAs access - this happens automatically
2. The reviewer should explore the code in the repository at GitHub.com
3. The reviewer should click on the line number for a line they have a comment for and select "Reference in new issue"
    - Good issues includes "I liked this because", "Won't this do the wrong thing because", and "I don't understand
      what's going on here"
4. When you receive issues from a reviewer, you should close the issues with a comment

### Starting PostGIS with Docker Compose

```yaml
version: "3"
services:
  postgis:
    container_name: postgis
    image: postgis/postgis
    ports:
      - "5432:5432"
```

### Importing a dataset into a PostGIS server in docker

`docker exec -i /postgis /usr/bin/psql --user postgres norway_data < tmp/Basisdata_0000_Norge_25833_Kommuner_PostGIS.sql`

### Creating a PostGIS API in Express

```typescript
import express from "express";
import pg from "pg";

const postgresql = new pg.Pool({
  user: "postgres",
  database: "norway_data",
});

const app = express();

app.get("/api/kommuner", async (req, res) => {
  const result = await postgresql.query(
    "select kommunenummer, kommunenavn, st_simplify(omrade, 0.0001)::json as geometry from kommuner",
  );
  res.json({
    type: "FeatureCollection",
    features: result.rows.map(({ kommunenavn, kommunenummer, geometry }) => ({
      type: "Feature",
      geometry,
      properties: { kommunenummer, kommunenavn },
    })),
  });
});

app.listen(3000);
```
