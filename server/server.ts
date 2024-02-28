import express from "express";

const app = express();

app.get("/api/profile", (req, res) => {
  res.json({ username: "Johannes" });
});

app.listen(3000);
