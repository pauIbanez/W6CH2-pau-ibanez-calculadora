const { Command } = require("commander");

const program = new Command();
program.option("-p, --port <number>");
program.parse();

module.exports = program.opts();
