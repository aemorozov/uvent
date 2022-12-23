const request = require("request");
const path = require("path");
const criticalcss = require("criticalcss");
const fs = require("fs");
const tmpDir = require("os").tmpdir();
const dotenv = require("dotenv").config();
const url = process.env.url;
// const url = 'http://localhost:8080'

const cssUrl = `${url}` + "/styles/style.css";
const cssPath = path.join(tmpDir, "style.css");

request(cssUrl)
  .pipe(fs.createWriteStream(cssPath))
  .on("close", function () {
    criticalcss.getRules(cssPath, function (err, output) {
      if (err) {
        console.log(err);
      } else {
        criticalcss.findCritical(
          `${url}`,
          { rules: JSON.parse(output) },
          function (err, output) {
            if (err) {
              console.log(err);
            } else {
              fs.writeFile(
                "public/styles/critical.css",
                output,
                function (err) {
                  if (err) return console.log(err);
                }
              );
            }
          }
        );
      }
    });
  });
