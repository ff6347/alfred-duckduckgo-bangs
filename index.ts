import fs from "fs";
import got from "got";
import jsdom from "jsdom";
const { JSDOM } = jsdom;

const vgmUrl = "https://duckduckgo.com/bang_lite.html";

got(vgmUrl)
  .then((response) => {
    const dom = new JSDOM(response.body);
    const rawBangs = dom.window.document.querySelector("span.small")
      ?.textContent;
    const lines = rawBangs?.split("\n");
    if (lines) {
      const cleanedLines = lines.filter((line) => line.length > 0);
      const csv = cleanedLines.map((line) => {
        return line.replace(/^\s*(.*?)\s+\((!.*?)\)$/, "$1,$2,$2");
      });
      console.log("we have", csv.length, "!bangs");
      const csvWithHeader = ["title,subtile,arg", ...csv];
      console.log(csvWithHeader);
      fs.writeFile("./bang.csv", csvWithHeader.join("\n"), "utf8", (err) => {
        if (err) throw err;
        console.log("wrote csv");
      });
    }
  })
  .catch((err) => {
    console.log(err);
  });
