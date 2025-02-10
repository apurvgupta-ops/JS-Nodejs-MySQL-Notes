import { open, readdir, readFile } from "fs/promises";
import http from "http";
import mime from "mime-types";

const server = http.createServer(async (req, res) => {
  if (req.url === "/favicon.ico") return "Not Found";

  // Read the directory so that we can get the internal files

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
      // res.setHeader("Content-Length", mime.contentType(fileState.size));
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
});

async function serverContent(req, res) {
  console.log("url= ", req.url);
  const listItems = await readdir(`./storage${decodeURIComponent(req.url)}`);
  console.log(listItems);

  // set the files name in the html
  let dynamicItems = "";
  listItems.forEach((item) => {
    dynamicItems += `
    ${item}
    <a href ='.${req.url === "/" ? "" : req.url}/${item}?action=open'> OPEN</a>
    <a href ='.${
      req.url === "/" ? "" : req.url
    }/${item}?action=download'> DOWNLOAD</a>

    
    <br>
    `;
  });

  const htmlFile = await readFile("./index.html", "utf-8");
  res.end(htmlFile.replace("${dynamicItems}", dynamicItems));
}

server.listen(80, "0.0.0.0", () => {
  console.log("Listening to the default port 80");
});
