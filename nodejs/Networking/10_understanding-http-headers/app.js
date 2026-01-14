import { createReadStream } from "node:fs";
import net from "node:net";

const server = net.createServer((socket) => {

  socket.write("HTTP/1.1 200 OKAY\n");
  socket.write("Access-Control-Allow-Origin: *\n");
  socket.write("Access-Control-Expose-Headers: Hello, name\n");
  socket.write("Hello: World\n");
  socket.write("name: anurag");
  socket.write("\n\n");

  // socket.end();
  const readStream = createReadStream("story.mp4");
  // const readStream = createReadStream("river.webp");
  // const readStream = createReadStream("numbers.txt");
  // const readStream = createReadStream(
  //   "C:\\Users\\anura\\OneDrive\\Desktop\\4k-video.MP4"
  // );
  readStream.pipe(socket);
  readStream.on("end", () => {
    console.log("File ended");
  });

  socket.on("data", (chunk) => {
    console.log(chunk.toString());
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
