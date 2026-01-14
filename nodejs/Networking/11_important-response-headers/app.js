import { createReadStream } from "node:fs";
import { open } from "node:fs/promises";
import net from "node:net";

const server = net.createServer(async (socket) => {
  // const fileHandle = await open(
  //   "C:\\Users\\anura\\OneDrive\\Desktop\\4k-video.MP4"
  // );
  const fileHandle = await open("story.mp4");
  const { size } = await fileHandle.stat();
  const readStream = fileHandle.createReadStream();
  socket.write("HTTP/1.1 200 OKAY\n");
  socket.write("Content-Type: video/mp4\n");
  // socket.write("Content-Type: text/txt; charset=utf-8\n");
  socket.write(`Content-Length: ${size}\n`);
  socket.write("Content-Disposition: attachment; filename=story.mp4");
  socket.write("\n\n");

  // socket.end();
  // const readStream = createReadStream("story.mp4");
  // const readStream = createReadStream("river.webp");
  // const readStream = createReadStream("numbers.txt");
  // const readStream = createReadStream(
  //   "C:\\Users\\anura\\OneDrive\\Desktop\\4k-video.MP4"
  // );
  readStream.pipe(socket);
  // socket.end('{"name": "Anurag"}')
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
