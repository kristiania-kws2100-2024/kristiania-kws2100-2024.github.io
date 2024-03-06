import express from "express";
import * as path from "path";

const app = express();

app.get("/api/kommuner", (req, res) => {
  res.sendFile(path.resolve("../public/kommuner.json"));
});

app.listen(3000);
