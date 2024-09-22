#!node
import fs from "fs/promises";

// For make this file dynamic;

// process.agrv give you the argument run in nodejs like node app.js ./text.txt , so here after these all are argument.
// console.log(process.argv);
const wordPath = process.argv[2];
const forPerticularWord = process.argv[3];

const content = await fs.readFile(wordPath, "utf-8");
// console.log(content);

// there are so many special characters, so break it,
const wordArray = content.split(/[\W]/).filter((w) => w);

const wordCounter = {};

wordArray.forEach((word) => {
  if (word in wordCounter) {
    wordCounter[word] += 1;
  } else {
    wordCounter[word] = 1;
  }
});

const perticularWord = forPerticularWord && wordCounter[forPerticularWord];
console.log(wordCounter);
console.log(perticularWord);

// :TODO : publish on npm as a cli package
