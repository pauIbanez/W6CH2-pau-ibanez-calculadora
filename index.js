require("dotenv").config();
const http = require("http");
const getParams = require("./program/getParams");

const port = process.env.PORT || 4000;
const server = http.createServer();
server.listen(port);

server.on("request", (request, response) => {
  const params = getParams(request.url);
  console.log(params);
  response.end();
});
