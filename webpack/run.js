const path = require("path");
const fs = require("fs");
var parseArgs = require('minimist');


// console.log("process.env", process.env);
// console.log("process.argv", process.argv);


const argv = process.argv.slice(2);
// console.log("argv", argv);
const args = parseArgs(argv);
// console.log('args: ', args);



if (args.mode === "dev") {
    require("./run.dev.js");
} else {
    require("./run.prod.js");
}



