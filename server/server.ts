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
app.get("/api/eiendommer", async (req, res) => {
  const result = await postgresql.query(
    `
        select json_build_object(
                       'type', 'FeatureCollection',
                       'features', json_agg(
                               json_build_object(
                                       'type', 'Feature',
                                       'geometry', st_asgeojson(representasjonspunkt)::json,
                                       'properties', json_build_object(
                                               'id', adresseid,
                                               'navn', adressetekst
                                                     )
                               )
                                   )
               )
        from vegadresse
        where st_contains(st_makeenvelope(
                                  10.778520961202608, 59.89164954785713, 10.801266093648895, 59.89752614937723,
                                  4326
                          ), representasjonspunkt);
    `,
  );
  res.json(result.rows[0].json_build_object);
});

app.listen(3000);
