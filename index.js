require("dotenv").config();
const http = require("http");
const fs = require("fs");
const path = require("path");
const getParams = require("./program/getParams");

const port = process.env.PORT || 4000;
const server = http.createServer();

const dir = path.join(__dirname, "public");
const mime = {
  html: "text/html",
  txt: "text/plain",
  css: "text/css",
  gif: "image/gif",
  jpg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  js: "application/javascript",
};

server.on("request", (request, response) => {
  const params = getParams(request.url);

  const requestPath = request.url.toString().split("?")[0];

  if (request.method !== "GET") {
    response.statusCode = 501;
    response.write("<h1>Method not implemented<h1>");
    response.end();
  }

  let file = path.join(dir, requestPath.replace(/\/$/, "/index.html"));

  if (file.split(".").length !== 2) {
    file += ".html";
  }

  if (!request.url.includes("calculator")) {
    if (file.indexOf(dir + path.sep) !== 0) {
      response.statusCode = 403;
      response.write("<h1>Forbidden<h1>");
      response.end();
    }

    const type = mime[path.extname(file).slice(1)] || "text/plain";
    const dataStream = fs.createReadStream(file);

    dataStream.on("open", () => {
      response.setHeader("Content-Type", type);
      dataStream.pipe(response);
    });

    dataStream.on("error", () => {
      response.statusCode = 404;

      response.write("<h1>Not Found<h1>");
      response.end();
    });
  }
});

server.listen(port);
