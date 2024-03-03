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
        select json_agg(json_build_object(
                'type', 'Feature',
                'geometry', st_asgeojson(st_simplify(omrade, 0.0001))::json,
                'properties', json_build_object(
                        'id', kommunenummer,
                        'navn', kommunenavn
                              )
                        )
               ) as features
        from kommune
    `,
  );
  res.json({ type: "FeatureCollection", features: result.rows[0].features });
});
app.get("/api/eiendommer", async (req, res) => {
  const { bbox } = req.query;
  if (!bbox) {
    return res.sendStatus(400);
  }
  const bounds = JSON.parse(bbox.toString());
  const result = await postgresql.query(
    `
        select json_agg(json_build_object(
                'type', 'Feature',
                'geometry', st_asgeojson(representasjonspunkt)::json,
                'properties', json_build_object('id', adresseid, 'navn', adressetekst)
                        )) as features
        from vegadresse
        where st_contains(st_makeenvelope($1, $2, $3, $4, 4326), representasjonspunkt);
    `,
    bounds,
  );
  res.json({ type: "FeatureCollection", features: result.rows[0].features });
});

app.listen(3000);
