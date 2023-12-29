"use strict"
import "dotenv/config.js"
import fs from "fs"
import cors from "cors"
import express from "express"
import ViteExpress from "vite-express"
import bodyParser from "body-parser"
import getMediaURLs from "./geturls.js"
import downloader from "./downloadcheck.js"
import remote from "./remote.js"

const app = express()
app.use(cors())
// app.use(express.json())
app.use(bodyParser.text({ type: ["text/plain", "application/json"] }))

const allowedDomains = [
  "http://localhost:5173",
  "http://localhost:3001",
  "http://159.223.36.123:3001",
  "https://download.cyclic.cloud"
  // "https://igram.ltd"
]

const regex = {
  instagram:
    /^https?:\/\/(?:www\.)?instagram\.com\/(?:p|reels?|tv)\/([a-zA-Z0-9_-]{11})\/?(?:\?.*)?$/,
  threads:
    /^https?:\/\/(?:www\.)?threads\.net\/(?:t|@?[a-z0-9._]{1,30}\/post)\/([a-zA-Z0-9_-]{11})\/?(?:\?.*)?$/
}
const isBetween = (value, num1, num2) => value > num1 && value < num2

function exeRemote(req, res, next) {
  const send = res.send
  res.send = function () {
    if (res.statusCode === 201 && process.env.LOG.charAt(0) === "1") remote(req)
    send.apply(res, arguments)
  }
  next()
}

app.post("/media/:platform", exeRemote, async (req, res) => {
  const domain = req.headers.origin?.split("//")?.[1]
  const platform = req.params.platform

  if (!domain)
    return res.status(400).json({
      error: "Required header 'origin' is missing."
    })
  if (!allowedDomains.includes(req.headers.origin))
    return res.status(400).json({
      error: "Requests from " + domain + " are not allowed."
    })
  if (!["instagram", "threads"].includes(platform))
    return res.status(400).json({
      error: "Provided platform is either invalid or currently not supported."
    })

  try {
    req.body = JSON.parse(req.body)
  } catch (e) {
    return res
      .status(400)
      .json({ error: "Request body is not in a valid JSON format." })
  }
  // prettier-ignore
  const quality = isBetween(Number(req.body.quality?.toString().replace(".", "x")), 0, 4) ? req.body.quality : "2"

  const matched = req.body.url?.match(regex[platform])
  if (!matched)
    return res.status(400).json({
      // prettier-ignore
      error: "Provided URL is not a valid " + platform[0].toUpperCase() + platform.slice(1) + " URL."
    })

  const dir = "dist/media/" + platform + "/" + matched[1] + quality
  if (fs.existsSync(dir)) {
    fs.writeFileSync(dir + "/.lastaccessed", Date.now().toString())
    return res.send(fs.readFileSync(dir + "/.items", "utf8"))
  }

  let links = await getMediaURLs[platform](
    req.body.url,
    quality / 3,
    matched[1]
  )

  if (!Array.isArray(links))
    return res.status(links.code).send({ error: links.msg })
  links = links?.filter(Boolean)

  if (!links.length)
    return res.status(404).json({
      error: "No media files found against provided URL."
    })

  fs.mkdirSync(dir)
  fs.writeFileSync(dir + "/.lastaccessed", Date.now().toString())

  downloader(links, platform, matched[1] + quality, res)
})

app.use((req, res, next) => {
  res.header(
    "Cross-Origin-Resource-Policy",
    allowedDomains.includes(req.headers.referer?.slice(0, -1))
      ? "cross-origin"
      : "same-origin"
  )
  next()
})

const setContentType = (req, res, next) => {
  if (req.query.download === "1")
    res.set("Content-Type", "application/octet-stream")
  next()
}
app.use(setContentType)

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => console.log("listening on port " + PORT))

ViteExpress.bind(app, server)
