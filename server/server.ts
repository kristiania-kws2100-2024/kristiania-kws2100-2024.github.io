import express from "express";
import pg from "pg";

const postgresql = new pg.Pool({ user: "postgres" });

const app = express();

app.get("/api/hello", (req, res) => {
  res.json({ hello: "world" });
});

app.get("/api/srids", async (req, res) => {
  const result = await postgresql.query("select * from spatial_ref_sys");
  res.json(result.rows.map(({ srid, auth_name }) => ({ srid, auth_name })));
});

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

app.listen(3000);
