import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/api/grunnkretser", (req, res) => {
  res.json({
    hello: "flat earth"
  })
})

app.listen(3000);

