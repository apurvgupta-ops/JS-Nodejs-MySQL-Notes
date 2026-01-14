import crypto from "crypto";
import { readFileSync } from "fs";

const fileData = readFileSync(
  "C:\\Users\\anura\\yt-downloads\\videos\\02 stateful vs stateless auth.mp4"
);

const hash = crypto
  .createHash("sha256")
  .update("Hello ")
  .update("World")
  .digest("base64url");

console.log(hash);

// console.log(
//   Buffer.from(
//     "pZGm1Av0IEBKARczz7exkNYsZb8LzaMrV7J32a2fFG4",
//     "base64url"
//   ).toString("hex")
// );
