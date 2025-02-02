import http from "http";

const server = http.createServer((req, res) => {
  res.end("Hello, World!");
});

server.listen(4000, () => {
  console.log("Server is listening on localhost, port 4000");
});
