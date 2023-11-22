"use strict"
import "dotenv/config.js"
import axios from "axios"
import "./utils/style.js"

const gbl = {
  instagram: {},
  threads: {},
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
}

function finalURL(e, quality) {
  const target =
    !e.video_versions || e.video_versions.length === 0
      ? e.image_versions2.candidates.slice(0, -7)
      : e.video_versions
  // console.log(target)

  return target.reverse()[Math.round(quality * target.length) - 1].url
}

function urlsFromItem(item, quality) {
  if (item.carousel_media_count)
    return item.carousel_media.map((e) => finalURL(e, quality))
  else return [finalURL(item, quality)]
}

const instagramOld = async (url) => {
  try {
    const html = await axios.get(url)
    // prettier-ignore
    const media = html.data.matchAll(/"width":"\d{1,4}","url":(.*?)\}|"contentUrl":(.*?),"thumbnailUrl"/g)
    return JSON.parse("[" + Array.from(media).map((e) => e[1] || e[2]) + "]")
  } catch (error) {
    console.log(error)
    return { code: 500, msg: "Internal Server Error." }
  }
}

const instagram = async (url, quality, shortcode) => {
  if (!process.env.IG_SESSIONID)
    throw new Error("Instagram Session ID is missing.".style(31))
  try {
    if (gbl.instagram.fb_dtsg_last_refresh !== new Date().toDateString()) {
      const html = await axios.get("https://www.instagram.com/", {
        validateStatus: () => true,
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "sec-fetch-site": "same-origin",
          cookie: "sessionid=" + process.env.IG_SESSIONID,
          "user-agent": gbl.userAgent
        }
      })
      gbl.instagram.fb_dtsg_last_refresh = new Date().toDateString()
      const fb_dtsg = html.data.match(/"f":"(.*)","l":null}/)
      console.log("fb_dtsg:", fb_dtsg ? fb_dtsg[1] : "Not Found")

      if (fb_dtsg) {
        delete gbl.instagram.error
        gbl.instagram.fb_dtsg = fb_dtsg[1]
      } else {
        gbl.instagram.error = "Session ID is not valid."
      }
    }
    if (gbl.instagram.error) return { code: 500, msg: gbl.instagram.error }

    const response = await axios.request(
      "https://www.instagram.com/api/graphql",
      {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "sec-fetch-site": "same-origin",
          cookie: "sessionid=" + process.env.IG_SESSIONID,
          "user-agent": gbl.userAgent
        },
        data:
          "fb_dtsg=" +
          encodeURIComponent(gbl.instagram.fb_dtsg) +
          "&variables=" +
          encodeURIComponent("{\"shortcode\":\"" + shortcode + "\"}") +
          "&doc_id=6984800508210440"
      }
    )

    if (!response.data.data)
      return { code: 404, msg: "No post is available for the provided URL." }
    // console.log(response.data)
    const item =
      response.data.data.xdt_api__v1__media__shortcode__web_info.items[0]

    // console.log(item)
    return urlsFromItem(item, quality)
  } catch (error) {
    console.log(error)
    return { code: 500, msg: "Internal Server Error." }
  }
}

const threads = async (url, quality) => {
  try {
    const html = await axios.get(url)
    const post_id = html.data.match(/"post_id":"(.*?)"},"entryPoint"/)
    console.log("post_id:", post_id ? post_id[1] : "Not Found")
    if (!post_id)
      return { code: 404, msg: "No post is available for the provided URL." }

    const response = await axios.request({
      method: "POST",
      url: "https://www.threads.net/api/graphql",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "x-fb-lsd": "1",
        "x-ig-app-id": "238260118697367"
      },
      data:
        "lsd=1&variables=" +
        encodeURIComponent("{\"postID\":\"" + post_id[1] + "\"}") +
        "&doc_id=5587632691339264"
    })

    // console.log(response.data)
    const item =
      response.data.data.data.containing_thread.thread_items.at(-1).post

    // console.log(item)
    return urlsFromItem(item, quality)
  } catch (error) {
    console.log(error)
    return { code: 500, msg: "Internal Server Error." }
  }
}

export default { instagram, threads }
