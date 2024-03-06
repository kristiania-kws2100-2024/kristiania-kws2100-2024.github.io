# Using PostGIS as a source of vector data

## Getting ready

1. Setup PostGIS using docker
2. Download kommuner from [geonorge](https://kartkatalog.geonorge.no/metadata/administrative-enheter-kommuner/041f1e6e-bdbc-4091-b48f-8a5990f3cc5b)
3. Import kommuner into the database
4. Explore the data:
   ```sql
   select st_asgeojson(st_transform(omrade, 4326))
   from kommuner
   where kommunenummer = '0301'
   ```

## Create a React application with OpenLayers

See [course notes](https://github.com/kristiania-kws2100-2024/kristiania-kws2100-2024.github.io/tree/main#reference-material)

## Create a geojson API with express

1. Create a server directory with express as dependency
2. Serve kommuner from file
3. Setup `vite.config.js` to proxy `/api`
