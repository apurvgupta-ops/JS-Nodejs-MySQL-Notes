import net from "node:net";

const server = net.createServer((socket) => {
  // This socket is a duplex stream
  socket.on("data", (chunk) => {
    console.log(chunk.toString());
    socket.write("HTTP\n\nGot your message.");
    socket.end();
  });
  socket.on("close", () => {
    console.log(socket.remoteAddress, ": Client disconnected");
  });

  socket.on("error", () => {
    console.log("Client Lost");
  });
  console.log("Client Connected", socket.remoteAddress);
});

server.listen(4000, "0.0.0.0", () => {
  console.log("Server started on port 4000");
});
