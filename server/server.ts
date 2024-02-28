import express from "express";

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

app.listen(3000);
