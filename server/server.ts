import express from "express";
import pg from "pg";

const postgresql = new pg.Pool({
  user: "postgres",
  database: "norway_data",
});

const app = express();

app.get("/api/kommuner", async (req, res) => {
  const result = await postgresql.query(
    "select kommunenummer, kommunenavn, st_simplify(st_transform(omrade, 4326), 0.001)::json as geometry from kommuner",
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

app.get("/api/adresser", async (req, res) => {
  const extent = JSON.parse(req.query.extent!.toString());
  const result = await postgresql.query(
    `select adresseid, adressetekst, st_transform(representasjonspunkt, 4326)::json as geometry
    from adresser
    where st_contains(st_makeenvelope($1, $2, $3, $4, 4326), st_transform(representasjonspunkt, 4326))
    limit 3000`,
    extent,
  );
  res.json({
    type: "FeatureCollection",
    features: result.rows.map(({ adresseid, adressetekst, geometry }) => ({
      type: "Feature",
      geometry,
      properties: { adresseid, adressetekst },
    })),
  });
});

app.listen(3000);
