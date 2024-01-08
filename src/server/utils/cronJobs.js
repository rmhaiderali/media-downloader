import fs from "fs"

function checkPostsForRemoval(interval) {
  const timeNowMinusInterval = Date.now() - interval
  //
  fs.readdirSync("content/media").forEach((platform) => {
    const platformPath = "content/media/" + platform
    //
    fs.readdirSync(platformPath).forEach((post) => {
      const postPath = platformPath + "/" + post
      //
      const lastAccessed = fs.readFileSync(postPath + "/.lastaccessed")
      if (post !== ".gitkeep" && lastAccessed < timeNowMinusInterval)
        fs.rmSync(postPath, { recursive: true })
      //
    })
    //
  })
}

const interval = 10 * 60 * 1000
setInterval(() => checkPostsForRemoval(interval), interval)
