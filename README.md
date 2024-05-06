# GIS demonstration 101

This demonstrates the following:

- Display a map (OpenLayers)
- Display vector features on a map (Sivilforsvaret > Offentlige tilfluktsrom from ([dsb](https://kart.dsb.no/))
- Hovering over a feature in the map
- Styling features based on properties
- Importing features into PostGIS ([Kommuner from Geonorge](https://kartkatalog.geonorge.no/metadata/administrative-enheter-kommuner/041f1e6e-bdbc-4091-b48f-8a5990f3cc5b))
- Creating a GeoJSON service with Express
- Displaying a WMTS layer ([Norge i bilder](https://register.geonorge.no/inspire-statusregister/norge-i-bilder-wms-ortofoto/dcee8bf4-fdf3-4433-a91b-209c7d9b0b0f))

## Getting started/doing it yourself

1. `npm install`
2. `npm run dev` (this starts Vite for frontend, Express for backend and Postgis in docker compose)
3. http://localhost:5173

## Hints

### GeoJSON service in Express

```typescript
app.get("/api/kommuner", async (req, res) => {
  const result = await postgresql.query(
    "select kommunenummer, kommunenavn, st_transform(omrade, 4326)::json geometry from kommuner",
  );
  res.json({
    type: "FeatureCollection",
    features: result.rows.map(({ kommunenummer, kommunenavn, geometry }) => ({
      type: "Feature",
      geometry,
      properties: { kommunenummer, kommunenavn },
    })),
  });
});
```

### WMTS parser:

```typescript
const parser = new WMTSCapabilities();

async function loadWtmsSource(
  url: string,
  config: { matrixSet: string; layer: string },
) {
  const res = await fetch(url);
  const text = await res.text();
  const result = parser.read(text);
  return new WMTS(optionsFromCapabilities(result, config)!);
}

async function loadPhotoLayer() {
  return await loadWtmsSource(
    "https://opencache.statkart.no/gatekeeper/gk/gk.open_nib_web_mercator_wmts_v2?SERVICE=WMTS&REQUEST=GetCapabilities",
    {
      layer: "Nibcache_web_mercator_v2",
      matrixSet: "default028mm",
    },
  );
}
loadPhotoLayer().then((source) => photoLayer.setSource(source));
```
