require("dotenv").config();
const http = require("http");

const port = process.env.PORT || 4000;
const server = http.createServer();
server.listen(port);

server.on("request", (request, response) => {
  response.end();
});
