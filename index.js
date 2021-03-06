require("dotenv").config();
const http = require("http");
const fs = require("fs");
const path = require("path");
const debug = require("debug")("calculator:root");
const chalk = require("chalk");
const { parse } = require("node-html-parser");

const { getParams, transformParams } = require("./program/paramUtils");
const calculate = require("./program/calculator");
const { port: passedPort } = require("./program/getArgs");

const port = passedPort || process.env.PORT || 4000;
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
    return;
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
      return;
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

    return;
  }

  let validParams = true;
  if (typeof params !== "object" || params.length < 2) {
    validParams = false;
  }

  if (validParams) {
    const wantedParams = params.slice(0, 2);
    const parsedParams = transformParams(wantedParams);

    let paramsAreNumbers = true;

    parsedParams.forEach(({ value: paramValue }) => {
      if (Number.isNaN(paramValue)) {
        paramsAreNumbers = false;
      }
    });
    if (paramsAreNumbers) {
      const results = calculate(parsedParams[0].value, parsedParams[1].value);
      const resultsFile = path.join(dir, "results.html");

      fs.readFile(resultsFile, (error, resultsHtml) => {
        if (error) {
          debug(
            chalk.redBright(
              `Opps, error was thrown: ${error.name} => ${error.message}`
            )
          );
          process.exit();
        }

        const htmlToInject = `
          <h1>Results:<h1>
          <h2>Sum:</h2>
          <p>${parsedParams[0].value} + ${
          parsedParams[1].value
        } = ${results[0].toFixed(2)}</p>
          <br/>
          <h2>Substraction:</h2>
          <p>${parsedParams[0].value} - ${
          parsedParams[1].value
        } = ${results[1].toFixed(2)}</p>
          <br/>
          <h2>Multiplication:</h2>
          <p>${parsedParams[0].value} * ${
          parsedParams[1].value
        } = ${results[2].toFixed(2)}</p>
          <br/>
          <h2>Division:</h2>
          <p>${parsedParams[0].value} / ${
          parsedParams[1].value
        } = ${results[3].toFixed(2)}</p>
        `;

        const tunedResultsHTML = parse(resultsHtml);

        const body = tunedResultsHTML.querySelector("body");

        body.set_content(htmlToInject);

        response.statusCode = 200;
        response.write(tunedResultsHTML.toString());
        response.end();
      });

      return;
    }
  }
  const invalidParamsFile = path.join(dir, "invalidNumber.html");
  const invalidParamsFileDataStream = fs.createReadStream(invalidParamsFile);

  invalidParamsFileDataStream.on("open", () => {
    response.setHeader("Content-Type", "text/html");
    invalidParamsFileDataStream.pipe(response);
  });
});

server.listen(port, () => {
  debug(chalk.yellowBright(`Server listening on port ${port}`));
});

server.on("error", (error) => {
  debug(
    chalk.redBright(`Opps, error was thrown: ${error.name} => ${error.message}`)
  );
});
