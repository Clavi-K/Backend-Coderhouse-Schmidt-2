const parseArgs = require("minimist")

const args = parseArgs(process.argv.slice(2))
const port = Number(args.p)

let result

if (!port || port == 1) {
    result = 8082
} else {
    result = args.p
}

module.exports = result