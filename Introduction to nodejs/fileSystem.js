// import fs from "node:fs";
import fs from "node:fs/promises";

// ! READ FILE
// ? This function is synchronous , means it blocks the call stack
// const content = fs.readFileSync("../Node Notes.txt").toString() // this function return the buffer of the file, for read in the proper format , use toString() .
// const content = fs.readFileSync("../Node Notes.txt", "utf-8"); // this also gives us a option of reading the file, utf-8 (binary encoding method)
// console.log(content);

// ? This function is asynsynchronous , means it not blocks the call stack
// const content = fs.readFile("../Node Notes.txt", "utf-8"); // this also gives us a option of reading the file, utf-8 (binary encoding method)
// console.log(content);

// ? This function is synchronous , means it blocks the call stack, but this comes from fs/promises
const content = await fs.readFile("../Node Notes.txt", "utf-8"); // this also gives us a option of reading the file, utf-8 (binary encoding method)
// console.log(content);

// ! WRITE FILE / APPEND FILE
// we are using promise version here
const data = await fs.writeFile("./text.txt", "hello"); // write file function always overight the data, or if there is no file then i create that file on the given path.
const data2 = await fs.appendFile("./text.txt", "hello"); // append file function always append the data, or if there is no file then i create that file on the given path.
