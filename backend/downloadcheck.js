"use strict";
import fs from "fs";
import https from "https";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const downloader = (links, platfrom, post, res) => {
  let changeHandler = {
    set: function (target, property, value, receiver) {
      target[property] = value;

      if (target.filter(Boolean).length === links.length)
        res.status(201).json({ url: paths });

      return true;
    },
  };
  const paths = new Proxy([], changeHandler);

  links.forEach((element, index) => {
    console.log(element);
    const filename = index + uuidv4() + path.extname(new URL(element).pathname);
    const file = fs.createWriteStream(
      "public/media/" + platfrom + "/" + post + "/" + filename
    );
    https.get(element, function (response) {
      response.pipe(file);

      file.on("finish", () => {
        file.close();
        paths[index] = post + "/" + filename;
        // console.log("Download Completed.");
      });
    });
  });
};

const interval = 10 * 60 * 1000;
setInterval(() => {
  // console.log(new Date());
  const time = Date.now() - interval;
  fs.readdirSync("public/media").forEach((platform) =>
    fs.readdirSync("public/media" + "/" + platform).forEach((post) => {
      // prettier-ignore
      if (post !== ".gitkeep" && Number(fs.readFileSync("public/media/" + platform + "/"+ post + "/.lastaccessed", "utf8")) < time)
      fs.rmSync("public/media/" + platform + "/"+ post, { recursive: true })
    })
  );
}, interval);

export default downloader;
