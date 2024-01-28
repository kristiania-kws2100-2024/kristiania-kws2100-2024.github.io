# KWS2100 Kartbaserte Websystemer: Exercise 3

Deploy a React application that lets the user click on information on a map

## Set up:

1. Create a repository and deploy it [like exercise 2](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/exercise/02). You can use the notes from [the course notes](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/?tab=readme-ov-file#manual-creation-to-avoid-lots-of-code).
2. Add a map with OpenLayers with an Open Street Map layer and a vector layer with [kommuner in Norway](https://www.eriksmistad.no/norges-fylker-og-kommuner-i-geojson-format/). You can use the notes from [the course notes](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/?tab=readme-ov-file#creating-a-openlayers-map-in-react). 
   - NB: The path to your `kommuner.json` must reflect the `base` path in your `vite.config.js`.
3. Commit and push your code to make sure it shows up on GitHub page

### Interactions with the map (exercise 2)

- The user should be able to focus on their own position
- The user should be able to toggle display of kommune layer on and off
- When the user clicks on the map with kommuner on, an overlay should show the name of the clicked feature
- The system should show a list of features in an aside
- When the user changes the view, the list of features in the aside should reflect what the user sees
- When the user hovers on a feature in the map, the feature should be highlighted in the aside
- When the user hovers on a feature in the aside, the feature should be highlighted in the map

### Display more layers:

1. Add [fylker](https://www.eriksmistad.no/norges-fylker-og-kommuner-i-geojson-format/)
   - NB: The `crs` definition in the GeoJSON must be removed for OpenLayers to handle it correctly. I'm not sure why
2. Add [countries of the world](https://github.com/datasets/geo-countries/)
   - NB: The dataset is too large to for prettier to work effectively with so the file should be added to `.prettierignore`
3. Add [Norwegian Railroad stations](https://kart.dsb.no/)
   - NB: Point features require an `image` on a style to be displayed on the map. The highlighted style from the other maps won't work

You can find GeoJSON files to add in addition to or instead of these.

## Tips:

- It's useful to extract code to helper functions, especially the code for keeping the active features up to date
- To deal with clicks and hovers, use `map.on` to add an event handler (and `map.un` to remove it) and use
  `layer.getSource().getFeaturesAtCoordinate()` to find the clicked feature
- To detect when data in a `VectorSource` has been updated, add a handler to the `source.on("change")` event
- To detect when the view extent changes, add a handler to `view.on("change")`

For a solution, check out [the reference code for lecture 4](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/reference/04)
