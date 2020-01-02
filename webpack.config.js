const path = require("path");

module.exports = {
  entry: {
    app: ["./lib/index.js", "./lib/IDB.js", "./lib/IDBObject.js"],
  },
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "idborm-utility.js",
    publicPath: "./lib",
  },
};
