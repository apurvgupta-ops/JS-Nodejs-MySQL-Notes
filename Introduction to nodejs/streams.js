import fs from "fs";

//if we want to send any file we use BUFFER , but this is only useful for the small data, becase it takes the space to load the data in the ram, For large dataset we use streams.

// highWaterMark is used to define how much data size of chnk we want to send.
const readStream = fs.createReadStream("path", { highWaterMark: 10 * 1024 });

// We have to append the chunck to get the file.
readStream.on("data", (chunk) => {
  fs.appendFileSync("file name", chunk);
});

// This is for get after the end
readStream.on("end", () => {
  console.log(end);
});
