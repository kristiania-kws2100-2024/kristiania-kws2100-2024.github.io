import express from "express";
import pg from "pg";

const postgresql = new pg.Pool({
  user: "postgres",
  database: "norway_data",
});

const app = express();

app.get("/api/kommuner", async (req, res) => {
  const result = await postgresql.query(
    "select kommunenummer, kommunenavn, st_simplify(omrade, 0.0001)::json as geometry from kommuner",
  );
  res.json({
    type: "FeatureCollection",
    features: result.rows.map(({ kommunenavn, kommunenummer, geometry }) => ({
      type: "Feature",
      geometry,
      properties: { kommunenummer, kommunenavn },
    })),
  });
});

app.get("/api/eiendommer", async (req, res) => {
  const result = await postgresql.query(
    `select adressenavn, adresseid, representasjonspunkt::json as geometry
     from adresser
     where adressenavn = 'Kongens gate'
     limit 3000
     `,
  );
  res.json({
    type: "FeatureCollection",
    features: result.rows.map(
      ({ adresseid, adressenavn, geometry: { type, coordinates } }) => ({
        type: "Feature",
        geometry: { type, coordinates },
        properties: { adresseid, adressenavn },
      }),
    ),
  });
});

app.listen(3000);
