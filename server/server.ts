import express from "express";
import pg from "pg";
import * as path from "path";

const app = express();

const postgresql = new pg.Pool({
  user: "postgres",
  password: "postgres",
  database: "norway_data",
});

app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(res.statusCode, req.method, req.path, req.query);
  });
  next();
});

app.get("/api/profile", (req, res) => {
  res.json({ username: "Johannes" });
});
app.get("/api/kommuner", async (req, res) => {
  const result = await postgresql.query(
    `
        select json_build_object(
                       'type', 'FeatureCollection',
                       'features', json_agg(
                               json_build_object(
                                       'type', 'Feature',
                                       'geometry', st_asgeojson(st_simplify(omrade, 0.0001))::json,
                                       'properties', json_build_object(
                                               'id', kommunenummer,
                                               'navn', kommunenavn
                                                     )
                               )
                                   )
               )
        from kommune
    `,
  );
  res.json(result.rows[0].json_build_object);
});

app.listen(3000);
