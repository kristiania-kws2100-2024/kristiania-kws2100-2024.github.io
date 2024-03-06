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

## Import more data

- [Statistiske enheter - grunnkretser](https://kartkatalog.geonorge.no/metadata/statistiske-enheter-grunnkretser/51d279f8-e2be-4f5e-9f72-1a53f7535ec1)
- [Matrikkelen - adresse](https://kartkatalog.geonorge.no/metadata/matrikkelen-adresse/f7df7a18-b30f-4745-bd64-d0863812350c)

Vegadresse. Example query:

```sql
select * from adresser
where adressenavn = 'Kongens gate' and nummer = 22
```

```sql
select a.adressetekst,
       b.adressetekst,
       st_distance(a.representasjonspunkt, b.representasjonspunkt)
from adresser a,
     adresser b
where a.adressenavn = 'Kongens gate'
  and a.nummer = 22
  and b.adressenavn = 'Urtegata'
  and b.nummer = 9;
```

```sql
select b.adressetekst,
       g.grunnkretsnavn,
       a.representasjonspunkt,
       g.omrade,
       st_asgeojson(a.representasjonspunkt),
       st_asgeojson(g.omrade)
from adresser a,
     adresser b,
     grunnkretser g
where a.adressenavn = 'Kongens gate'
  and a.nummer = 22
  and st_dwithin(a.representasjonspunkt, b.representasjonspunkt, 100.0, true)
  and st_contains(g.omrade, a.representasjonspunkt)
;
```
