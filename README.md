# KWS2100 Kartbaserte Websystemer: Exercise 8

Serve vector layer from PostGIS

## Prerequisites

What you should already have done:

- Create a local react application with OpenLayers
- Show a polygon vector layer in OpenLayers (e.g. kommune)
- Show a point vector layer in OpenLayers (e.g. schools)

Expected knowledge from before:

- Create an Express application
- Run a docker compose script
- Connect to a database using IntelliJ

## The task

Instead of serving geographical data from a static file, we want to serve it from a database

## Part 1: Import data in PostGIS

1. Create a `docker-compose.yaml` with postgis
2. Download [kommuner](https://kartkatalog.geonorge.no/metadata/administrative-enheter-kommuner/041f1e6e-bdbc-4091-b48f-8a5990f3cc5b)
   from Geonorge
3. Import kommuner into PostGIS
   - Hint: "docker exec -i postgis /usr/bin/psql --user postgres norway_data < **path to .sql-file**"
4. Download [addresses](https://kartkatalog.geonorge.no/metadata/matrikkelen-adresse/f7df7a18-b30f-4745-bd64-d0863812350c)
   from Geonorge and import into PostGIS - Hint: "docker exec -i postgis /usr/bin/psql --user postgres norway_data < **path to .sql-file**"
5. Download [grunnkrets](https://kartkatalog.geonorge.no/metadata/matrikkelen-adresse/f7df7a18-b30f-4745-bd64-d0863812350c)
   from Geonorge and import into PostGIS - Hint: "docker exec -i postgis /usr/bin/psql --user postgres norway_data < **path to .sql-file**"
6. Connect to the database using IntelliJ and copy data from imports
   - `create table public.kommune as select kommunenummer, ... from schema.kommune`
   - Hint: If you use `st_transform` to convert the reference system to the data, you will be able to join later
   - `alter table public.kommune add primary key`
   - `create index kommune_omrade on kommune using gist (omrade)`

## Part 2: Explore data in PostGIS

- Find the address id for the schools address
- Find all addresses within 100 meters of a given addresses
  - Hint: Use the [`ST_DWithin`](https://postgis.net/docs/ST_DWithin.html)-function
- Include the distance of each match from the given address
  - Hint: Use the [`ST_Distance`](https://postgis.net/docs/ST_Distance.html)-function
- Join the addresses from the previous step with the grunnkrets where they reside
  - Hint: Use the [`ST_Contains`](https://postgis.net/docs/ST_Contains.html)-function

## Part 3: Expose kommune-data with Express

Hint: Use [`st_asgeojson()::json`](https://postgis.net/docs/ST_AsGeoJSON.html) to export data. Adjust the amount of data
exported with [`st_simplify()`](https://postgis.net/docs/ST_Simplify.html)

## Part 4: Consume data with OpenLayers

Set up `vite.config.js` to use express as backend:

```js
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
```

# Part 5: Expose properties with OpenLayers

Hint: The VectorSource must have a loading strategy that makes it load only on high resolutions, and a loading
function that sends the bounding box to the API. The API must
use `st_contains(st_makeenvelope($1, $2, $3, $4, 4326), representasjonspunkt)`
