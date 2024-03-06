import express from "express";
import pg from "pg";

const postgresql = new pg.Pool({
  user: "postgres",
  database: "norway_data",
});

const app = express();

app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(res.statusCode, req.method, req.path, req.query);
  });
  next();
});

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
  const { bbox } = req.query;
  if (!bbox) {
    return res.sendStatus(400);
  }
  const bounds = JSON.parse(bbox.toString());
  const result = await postgresql.query(
    `select adressenavn, adresseid, representasjonspunkt::json as geometry
     from adresser
     where st_contains(st_makeenvelope($1, $2, $3, $4, 4326), representasjonspunkt)
     limit 3000
     `,
    bounds,
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
