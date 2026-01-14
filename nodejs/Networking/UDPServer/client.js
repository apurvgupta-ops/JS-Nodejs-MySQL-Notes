import dgram from "node:dgram";

const socket = dgram.createSocket("udp4");

socket.on("message", (message, remoteAddress) => {
  console.log(message.toString(), remoteAddress);
});

socket.send("hello from clientjs", 4000, "192.168.1.2", () => {
  console.log("messgae sent");
});
