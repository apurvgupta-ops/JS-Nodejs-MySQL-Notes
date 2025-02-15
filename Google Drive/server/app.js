import { open, readdir, readFile, rename, rm } from "fs/promises";
import http from "http";
import mime from "mime-types";
import { createWriteStream } from "fs";

const server = http.createServer(async (req, res) => {
  if (req.url === "/favicon.ico") return "Not Found";
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  // Read the directory so that we can get the internal files

  if (req.method === "GET") {
    if (req.url === "/") {
      await serverContent(req, res);
    } else {
      try {
        const [url, queryString] = req.url.split("?");
        console.log({ url, queryString });
        const queryParams = {};
        queryString.split("&").forEach((query) => {
          const [key, value] = query.split("=");
          queryParams[key] = value;
        });

        console.log(queryParams);
        // console.log(mime.contentType(url.slice(1)));

        const fileOpen = await open(`./storage${decodeURIComponent(url)}`);
        const fileState = await fileOpen.stat();

        res.setHeader("Content-Type", mime.contentType(url.slice(1)));
        // res.setHeader("Content-Length", mime.contentType(fileState.size)); // to show the download progress bar.
        if (queryParams.action == "download") {
          res.setHeader(
            "Content-Disposition",
            mime.contentType(`attachment; filename="${url.slice(1)}"`)
          );
        }

        if (fileState.isDirectory()) {
          await serverContent(req, res);
        } else {
          const filetream = fileOpen.createReadStream();
          filetream.pipe(res);
        }
      } catch (error) {
        console.log(error);
        res.end("Not Found");
      }
    }
  } else if (req.method === "OPTIONS") {
    res.end("OK");
  } else if (req.method === "POST") {
    const writeStream = createWriteStream(`./storage/${req.headers.filename}`);
    // we face one issue if we not end the writeStream, the readon is when we upload the file the fileDiscriptor of the file holds the nodejs process, thats whjy when we uplaod a file we can't delete instantly, we need to refresh the page so that FD remove the hold of nodejs. we can use pipe method they handle this autmatically.
    req.on("data", (chunk) => {
      writeStream.write(chunk);
      // console.log({ chunk });
    });

    req.on("end", () => {
      // writeStream.end();
      res.end("File uploaded successfully");
    });
  } else if (req.method === "DELETE") {
    req.on("data", async (chunk) => {
      const filename = chunk.toString();
      await rm(`./storage/${filename}`);
      res.end("File Deleted successfully");
    });
  } else if (req.method === "PATCH") {
    req.on("data", async (chunk) => {
      const filename = JSON.parse(chunk.toString());
      await rename(
        `./storage/${filename.oldFileName}`,
        `./storage/${filename.newFileName}`
      );
      res.end("Renamed Successfully");
    });
  }
});

async function serverContent(req, res) {
  const [url] = req.url.split("?");
  const listItems = await readdir(`./storage${decodeURIComponent(url)}`);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(listItems));
}

server.listen(80, "0.0.0.0", () => {
  console.log("Listening to the default port 80");
});
