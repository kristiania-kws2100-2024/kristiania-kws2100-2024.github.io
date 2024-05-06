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

app.listen(3000);
