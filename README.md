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

### Lecture 2: Vector layers

We will add more layers to the map

### Lecture 3: Interacting with polygon features

Zooming to your location, hovering and clicking on features.

### Lecture 4: Deploying with GitHub pages

### Lecture 5: Interacting with point features

### Lecture 6: Tile layers and map projections

**"Damn you, Gerhard!"**

### Lecture 7: Query property data

Using the [Norwegian Land Register](https://kartkatalog.geonorge.no/metadata/matrikkelen-eiendomskart-teig/74340c24-1c8a-4454-b813-bfe498e80f16), we will develop functionality to show properties close to the users location on a map

### Lecture 8: Assigment: Deployment of simple map applications

### Lecture 9: Importing road data

Using Elveg, [the Norwegian Road Network](https://kartkatalog.geonorge.no/metadata/elveg-20/77944f7e-3d75-4f6d-ae04-c528cc72e8f6), we will import a dataset into PostGIS to query it.

### Lecture 10: Vector layers and styles

### Lecture 11: Getting ready for the exam

## Reference material

### Creating a basic React application with Vite and TypeScript

`npm create vite@latest -- --template react-ts`

### Creating a OpenLayers map in React

```tsx
useGeographic();
const map = new Map({
  view: new View({ center: [11, 60], zoom: 10 }),
  layers: [new TileLayer({source: new OSM()})]
})

function App() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    map.setTarget(mapRef.current);
  }, []);

  return (
    <div ref={mapRef}></div>
  )
}
```

### Creating a PostGIS API in Express



