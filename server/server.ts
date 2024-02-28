import express from "express";
import * as path from "path";

const app = express();

app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(res.statusCode, req.method, req.path);
  });
  next();
});

app.get("/api/profile", (req, res) => {
  res.json({ username: "Johannes" });
});
app.get("/api/kommuner", (req, res) => {
  res.sendFile(path.resolve("./public/kommuner_komprimert.json"));
});

app.listen(3000);
