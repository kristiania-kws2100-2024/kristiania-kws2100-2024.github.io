# KWS2100 Kartbaserte Websystemer: Exercise 6

Change the base layer of a map

## Prerequisites

What you should already have done:

- Deploy a React application with GitHub pages
- Show OpenStreetMap in OpenLayers (on GitHub pages)
- Display a few vector layers that should be possible to turn on and off
  - At least one polygon layer, for example [Norwegian kommuner](https://www.eriksmistad.no/norges-fylker-og-kommuner-i-geojson-format/)
  - At least one point layer, for example from [the Norwegian Directorate for Civil Protection (DSB)](https://kart.dsb.no/) map Infrastruktur > Mini- og mikrokraftverk
- Interact with the vector layers with mouse hover or click
- Show an aside with visible features in the layer

If you aren't comfortable with this, you should consider doing the earlier exercises again.

## The task:

Add a selector that lets the user change the base map of you application. You can use the following maps:

- [Stadia Maps](https://docs.stadiamaps.com/). You can play with different theming
- Ortophoto maps, e.g. [Norge i bilder](https://kartkatalog.geonorge.no/metadata/norge-i-bilder-wmts-mercator/d639038c-a75b-446a-ad0c-16301cabfd21)
- Other WMTS maps, e.g. [sjøkart over Norge](https://kartkatalog.geonorge.no/metadata/sjoekart-raster-cache-wmts/72044503-938b-4955-a931-9e5a7eabf28e)
- Maps with radically different projection, e.g. [Arctic Spacial Data Infrastructure topographic basemap](https://arctic-sdi.org/services/topografic-basemap/)

## Additional questions

- You can add multiple base maps by making them transparent
- You can look for more base maps, especially vector tile layers

For a solution, check out [the reference code for lecture 6](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/reference/06)
