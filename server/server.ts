import express from "express";
import pg from "pg";
import * as path from "path";

const postgresql = new pg.Pool({
  user: "postgres",
  database: "norway_data",
});

const app = express();

app.get("/api/kommuner.new", async (req, res) => {
  const result = await postgresql.query(
    "select kommunenummer, kommunenavn, omrade::json from kommuner",
  );
  console.log(result.rows[0].omrade);
  res.json({
    type: "FeatureCollection",
    features: result.rows.map((row) => ({
      type: "Feature",
      //geometry: row.omrade,
      properties: {
        kommunenummer: row.kommunenummer,
        navn: row.kommunenavn,
      },
    })),
  });
});

app.get("/api/kommuner", async (req, res) => {
  res.sendFile(path.resolve("../public/kommuner.json"));
});

app.listen(3000);
