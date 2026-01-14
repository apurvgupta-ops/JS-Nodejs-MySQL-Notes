import express from "express";

const app = express();
const port = 4000;

app.get(
  "/",
  (req, res) => {
    // Request Handler Middlewares - 3 Params
    console.log("Running Middleware 1");
    console.log(num);
    res.end("hii");
  },
  (err, req, res, next) => {
    // Error Handler Middlewares - 4 Params
    console.log({ err: err.message });
    console.log("Running Error Middleware");
    res.end(err.message);
  },
  (req, res) => {
    // Request Handler Middlewares - 2 Params
    console.log("Running Middleware 2");
    res.end("Hello World! 2");
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
