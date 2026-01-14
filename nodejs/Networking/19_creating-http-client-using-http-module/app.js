import http from "node:http";

const server = http.createServer((request, response) => {
  console.log("Got the request");
  console.log(request.method);
  console.log(request.url);
  request.on("data", (chunk) => {
    console.log(chunk.toString());
  });
  response.end("Hello from http server.");
});

server.listen(4000, "0.0.0.0", () => {
  console.log("Server started");
});
