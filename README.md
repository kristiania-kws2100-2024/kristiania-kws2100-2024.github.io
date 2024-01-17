cd# KWS2100 Kartbaserte Websystemer: Exercise 2

Deploy a React application that lets the user click on information on a map

## Deployment

1. Create a new GitHub repository on your GitHub account
2. Clone the project locally (with IntelliJ: File > New > Project from Version Control)
3. Create an empty npm project: `echo {} > package.json`
4. Add `vite` and `typescript` dev dependencies
   - `npm install -D vite`
5. Create a `dev` and `build` task which calls `vite` and `vite build`, respectively
   - `npm pkg set scripts.dev=vite`
6. Create `index.html`
7. Create a GitHub Action workflow that calls `npm run build`. You can use GitHub's built-in workflow templates
   as a starting point
8. Update your GitHub Actions workflow to include [GitHub pages deployment](https://github.com/actions/deploy-pages)
   - *NB*: You need to tell Vite to use a different base path. This was not showed in lecture
     ```javascript
     // vite.config.js
     export default {
       base: "/<your repo name, for example kws2100-exercise>"
     }
     ```

You should improve the build process:
- Add Typescript checking and prettier to the build process
- Add husky to avoid bad commits

## Display and interact with information on map

1. Add `react`, `react-dom` dependencies (plus @types definitions)
2. Create `src/index.tsx` with a simple React application
3. Add `ol` dependency and create a map with the Open Street Maps layer
4. Add [kommuner in Norway](https://www.eriksmistad.no/norges-fylker-og-kommuner-i-geojson-format/) as a vector layer
   - NB: The path to your `kommuner.json` must reflect the `base` path in your `vite.config.js`.
5. Commit and push your code to make sure it shows up on GitHub page
6. Add a click handler on the map that displays the name of the clicked kommune in a dialog

You should improve the interaction:
- Add a toggle to add and remove the kommune layer and the click handler

## Tips:

- GitHub pages can be deployed by adding the `steps` `actions/upload-pages-artifact@v3` (specifies `path`) and
  `actions/deploy-pages@v4`. This requires write permissions `pages` and `id-token` in the workflow file
  and a `github-pages` environment variable
- In order to display a map with OpenLayers, you have to create a Map object with a View and at least one layer.
  The view must have center and zoom
- You can use `new OSM()` (for Open Street Maps) as your first layer
- Make sure you call the OpenLayers function `useGeographic()` at the top of your file. Otherwise, positions will be
  displayed as meters from the equator instead of degrees latitude and longitude
- If things are working weird, make sure you have `import {Map} from "ol"`, as there is a core JavaScript object that
  is also called `Map`. Also, avoid calling your React component ~~`Map`~~ (as I once did and struggled with for a
  long time)
- A common error is for the map `<div>` to have zero size. Make sure you style it with `height` and `width`
- To deal with clicks, use `map.on` to add an event handler (and `map.un` to remove it) and use
  `layer.getSource().getFeaturesAtCoordinate()` to find the clicked feature

For a solution, check out [the reference code for lecture 2](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/reference/02)
