import net from "node:net";

process.stdin.on("data", (input) => {
  socket.write(input);
});

const socket = net.createConnection({ host: "192.168.0.105", port: 4000 });

socket.on("error", () => {
  console.log("Server Lost");
});

socket.on("data", (chunk) => {
  console.log(chunk.toString());
});
