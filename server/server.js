import express from "express";
import pg from "pg";

const postgresql = new pg.Pool({ user: "postgres" });

const app = express();

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/api/kommuner", async (req, res) => {
  const dbResult = await postgresql.query(
    `select kommunenavn, kommunenummer,
       st_simplify(st_transform(omrade, 4326), 0.001)::json geometry
    from kommuner_e1b95ab2fb054ee7998946cce6039771.kommune
    `,
  );
  res.json({
    type: "FeatureCollection",
    features: dbResult.rows.map((row) => ({
      type: "Feature",
      geometry: row.geometry,
      properties: {
        id: row.kommunenummer,
        name: row.kommunenavn,
      },
    })),
  });
});

app.listen(3000);
