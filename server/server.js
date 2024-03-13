import express from "express";
import pg from "pg";

const postgresql = new pg.Pool({ user: "postgres" });

const app = express();

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/api/kommuner", async (req, res) => {
  const dbResult = await postgresql.query("select * from kommuner_e1b95ab2fb054ee7998946cce6039771.kommune");
  res.json({ dbResult })
})

app.listen(3000);


