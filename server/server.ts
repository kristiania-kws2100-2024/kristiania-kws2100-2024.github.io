import express from "express";
import pg from "pg";

const postgresql = new pg.Pool({
  user: "postgres",
  database: "norway_data",
});

const app = express();

app.get("/api/kommuner", async (req, res) => {
  const result = await postgresql.query(
    "select kommunenummer, kommunenavn, st_transform(st_simplify(omrade, 10), 4326)::json as omrade from kommuner",
  );
  res.json({
    type: "FeatureCollection",
    features: result.rows.map(({ kommunenavn, kommunenummer, omrade }) => ({
      type: "Feature",
      geometry: omrade,
      properties: { kommunenummer, kommunenavn },
    })),
  });
});

app.listen(3000);
