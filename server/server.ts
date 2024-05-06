import express from "express";

const app = express();

app.get("/api/hello", (req, res) => {
  res.json({ hello: "world" });
});

app.listen(3000);
