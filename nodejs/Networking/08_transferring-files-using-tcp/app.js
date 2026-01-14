import { createReadStream, createWriteStream, read } from "node:fs";
import net from "node:net";

process.stdin.on("data", (input) => {
  const inputStr = input.toString();
  const [clientIndex] = inputStr.split(" ");
  console.log(clientIndex);
  if (typeof parseInt(clientIndex) === "number") {
    clientsList[parseInt(clientIndex)].write(inputStr.substring(1));
  } else {
    clientsList.forEach((socket) => {
      socket.write(input);
    });
  }
});

const clientsList = [];

const server = net.createServer((socket) => {
  clientsList.push(socket);
  console.log(clientsList.length);

  // const readStream = createReadStream("story.mp4");
  // readStream.pipe(socket);
  // readStream.on("end", () => {
  //   console.log("File ended");
  // });

  const writeStream = createWriteStream("story.mp4");
  socket.pipe(writeStream);
  // socket.on("data", (chunk) => {
  //   writeStream.write(chunk);
  //   console.log("got data");
  // });
  
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
