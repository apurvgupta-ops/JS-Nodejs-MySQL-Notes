import express from "express";

const app = express();

app.get("/directory", (req, res) => {
  res.redirect(301, "/folder");
});

app.get("/folder", (req, res) => {
  res.json({
    name: "images",
    files: ["Node.png", "js.webp"],
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
