# KWS2100 Kartbaserte Websystemer: Exercise 4

Display and style point features on a map 

## Set up:

1. Create a repository and deploy it [like exercise 2](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/exercise/02). You can use the notes from [the course notes](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/?tab=readme-ov-file#manual-creation-to-avoid-lots-of-code).
2. Add a map with OpenLayers with an Open Street Map layer and a vector layer from [kart.dsb.no]. I recommend "Mini- og mikrokraftverk" (under "Infrastruktur"). You can use the notes from [the course notes](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/?tab=readme-ov-file#creating-a-openlayers-map-in-react). 
   - NB: The path to your vector layer must reflect the `base` path in your `vite.config.js`.
3. Commit and push your code to make sure it shows up on GitHub page

### Style the map

- Choose color, style and size based on the feature properties of your chosen feature layer
- Add a list of currently visible features in an aside, like with polygon features
- Show text for each feature (optional: display text based on the view resolution to avoid clutter)
- Add hover or click functionality to the feature layer. Note: use `map.forEachFeatureAtPixel` instead of `VectorSource.getFeatureAtCoordinate`

For a solution, check out [the reference code for lecture 5](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/reference/05)
