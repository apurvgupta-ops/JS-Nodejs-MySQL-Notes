import dgram from "node:dgram";

const socket = dgram.createSocket("udp4");

socket.on("message", (message, remoteAddress) => {
  console.log(message.toString(), remoteAddress);

  socket.send(
    "message received successfully",
    remoteAddress.port,
    remoteAddress.address
  );
});

socket.bind({ port: 4000 }, () => {
  console.log("listeinng");
});

// we can send file to with UDP and streams inside it.
