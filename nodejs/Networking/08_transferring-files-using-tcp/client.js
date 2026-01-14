import { createReadStream, createWriteStream } from "node:fs";
import net from "node:net";

process.stdin.on("data", (input) => {
  const inputString = input.toString().trim();
  console.dir(inputString);
  if (inputString === "send") {
    const readStream = createReadStream(
      "C:\\Users\\anura\\OneDrive\\Desktop\\Story of Internet.mp4"
    );

    readStream.pipe(socket);
    readStream.on("end", () => {
      console.log("File ended");
    });
  }
});

const socket = net.createConnection({ host: "192.168.0.105", port: 4000 });

const writeStream = createWriteStream(
  "C:\\Users\\anura\\OneDrive\\Desktop\\my-story.mp4"
);

// const readStream = createReadStream(
//   "C:\\Users\\anura\\OneDrive\\Desktop\\Story of Internet.mp4"
// );

// readStream.pipe(socket);
// readStream.on("end", () => {
//   console.log("File ended");
// });

socket.on("error", () => {
  console.log("Server Lost");
});

// socket.on("data", (chunk) => {
//   writeStream.write(chunk);
// });
