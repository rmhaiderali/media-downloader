"use strict"
import fs from "fs"
import https from "https"
import path from "path"
import sharp from "sharp"
import { v4 as uuidv4 } from "uuid"

const downloader = (links, platfrom, post, res) => {
  const postDirectory = "dist/media/" + platfrom + "/" + post + "/"

  let changeHandler = {
    set: function (target, property, value, receiver) {
      target[property] = value

      if (target.filter(Boolean).length === links.length) {
        fs.writeFileSync(postDirectory + ".items", JSON.stringify({ items }))
        res.status(201).json({ items })
      }

      return true
    }
  }
  const items = new Proxy([], changeHandler)

  links.forEach((element, index) => {
    console.log(element)
    const extention = path.extname(new URL(element).pathname)
    const filename = index + uuidv4() + extention
    const file = postDirectory + filename

    https.get(element, function (response) {
      const data = []
      response.on("data", function (chunk) {
        data.push(chunk)
      })

      response.on("end", async () => {
        const buffer = Buffer.concat(data)
        fs.writeFileSync(file, buffer)

        if (extention === ".mp4") {
          items[index] = { path: post + "/" + filename, format: "mp4" }
        } else {
          const image = sharp(buffer)
          const metadata = await image.metadata()

          const size = { width: 300, height: 300 }
          if (metadata.height < metadata.width) delete size.height
          else if (metadata.width < metadata.height) delete size.width

          const blur = await image.resize(size).blur(30).toBuffer()
          items[index] = {
            path: post + "/" + filename,
            format: metadata.format,
            width: metadata.width,
            height: metadata.height,
            blur: blur.toString("base64")
          }
        }
        // console.log("Download Completed.")
      })
    })
  })
}

const interval = 10 * 60 * 1000
setInterval(() => {
  // console.log(new Date())
  const time = Date.now() - interval
  fs.readdirSync("dist/media").forEach((platform) =>
    fs.readdirSync("dist/media" + "/" + platform).forEach((post) => {
      // prettier-ignore
      if (post !== ".gitkeep" && Number(fs.readFileSync("dist/media/" + platform + "/"+ post + "/.lastaccessed", "utf8")) < time)
      fs.rmSync("dist/media/" + platform + "/"+ post, { recursive: true })
    })
  )
}, interval)

export default downloader
