const fs = require("fs");
const ejs = require("ejs");
const encoding = "utf-8";

const copyTemplateFile = function (fromFile, toFile, data) {
  const template = fs.readFileSync(`${fromFile}`, encoding);
  const file = ejs.render(template, data);
  fs.writeFileSync(`${toFile}`, file, encoding);
};

module.exports = copyTemplateFile;
