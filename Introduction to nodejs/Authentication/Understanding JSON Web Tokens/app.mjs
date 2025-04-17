import jwt from "jsonwebtoken";
import { createHmac } from "node:crypto";

const token = jwt.sign({ name: "Bilal" }, "secret", {
  algorithm: "HS256",
  expiresIn: 10,
});

// console.log(token);

console.log(
  jwt.decode(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQmlsYWwiLCJpYXQiOjE3NDM2NDc4NDksImV4cCI6MTc0MzY0Nzg1OX0.sdf"
  )
);

// console.log(
//   Buffer.from(
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQmlsYWwiLCJpYXQiOjE3NDM2NDYxMjV9",
//     "base64url"
//   ).toString()
// );

// const token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQmlsYWwiLCJpYXQiOjE3NDM2NDYyMDR9.yC98vaKasra-utjWHrXTZDRKxLkDn_0HQJDHDICmUIU";

// console.log(
//   createHmac("sha256", "secret")
//     .update(
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQmlsYWwiLCJpYXQiOjE3NDM2NDYyMDR9"
//     )
//     .digest("base64url")
// );