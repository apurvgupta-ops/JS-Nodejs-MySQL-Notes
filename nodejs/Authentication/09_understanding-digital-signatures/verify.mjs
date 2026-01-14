import crypto from "node:crypto";
import { createWriteStream } from "node:fs";
import { readFile } from "node:fs/promises";

const signedFileContent = await readFile("loan-agreement-signed.md", "utf-8");
const [fileContent, signature] = signedFileContent.split("हस्ताक्षर:- ");
const mySecretKey = "my-super-secret-key";

const newSignature = crypto
  .createHash("sha256")
  .update(fileContent + "हस्ताक्षर:- ")
  .update(mySecretKey)
  .digest("base64url");

console.log(newSignature);
console.log(signature);

if (newSignature === signature) {
  console.log("Perfect, the letter is valid. Here is your money.");
} else {
  console.log("Ohh no, this letter is invalid. I can't give you money.");
}
