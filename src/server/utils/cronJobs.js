import fs from "fs";
import path from "path";

function checkPostsForRemoval(interval) {
  // console.log(new Date());
  const timeNowMinusInterval = Date.now() - interval;
  //
  const media = path.join(process.cwd(), "media/");
  fs.readdirSync(media).forEach((platform) => {
    const platformPath = media + platform;
    //
    fs.readdirSync(platformPath).forEach((post) => {
      if (post == ".gitkeep") return;
      const postPath = platformPath + "/" + post;
      //
      const lastAccessed = fs.readFileSync(postPath + "/.lastaccessed");
      if (lastAccessed < timeNowMinusInterval)
        fs.rmSync(postPath, { recursive: true });
      //
    });
    //
  });
}

const interval = 30 * 60 * 1000;
setInterval(() => checkPostsForRemoval(interval), interval);
