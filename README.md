# KWS2100 Kartbaserte Websystemer: Exercise 1

Create a React application that displays information on a map

1. Use [Vite](https://vitejs.dev/guide/) to create a React + Typescript application
2. Verify that you can make changes and see them displayed in the web page
3. Replace the App component with a component that uses Openlayers to display a map
4. Add [kommuner in Norway](https://www.eriksmistad.no/norges-fylker-og-kommuner-i-geojson-format/) as a vector layer
5. (Optional) Deploy the application using Github pages
6. (Optional) Style the vector layer

## Tips:

- In order to display a map with Openlayers, you have to create a Map object with a View and at least one layer.
  The view must have center and zoom
- You can use `new OSM()` (for Open Street Maps) as your first layer
- Make sure you call the OpenLayers function `useGeographic()` at the top of your file. Otherwise, positions will be
  displayed as meters from the equator instead of degrees latitude and longitude
- If things are working weird, make sure you have `import {Map} from "ol"`, as there is a core JavaScript object that
  is also called `Map`. Also, avoid calling your React component ~~`Map`~~ (as I once did and struggled with for a
  long time)
- A common error is for the map `<div>` to have zero size. Make sure you style it with `height` and `width`

For a solution, check out [the reference code for lecture 1](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/reference/01)
