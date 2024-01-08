import fs from "fs";
import path from "path";
import { allowedDomains, platformRegex } from "../constants/app.constants.js";
import getItems from "./media/fetchItemsUrls.js";
import downloadItems from "./media/downloadItems.js";

async function main(req, res) {
  const domain = req.headers.origin?.split("//")?.[1];
  const { platform } = req.params;

  if (!domain)
    return res.status(400).json({
      error: "Required header 'origin' is missing.",
    });
  //
  if (!allowedDomains.includes(req.headers.origin))
    return res.status(400).json({
      error: "Requests from " + domain + " are not allowed.",
    });
  //
  if (!["instagram", "threads"].includes(platform))
    return res.status(400).json({
      error: "Provided platform is not supported.",
    });

  try {
    req.body = JSON.parse(req.body);
  } catch (e) {
    return res
      .status(400)
      .json({ error: "Request body is not in a valid JSON format." });
  }

  const quality = req.body.quality?.toString().match(/^[1-3]$/)?.[0];

  if (!quality)
    return res.status(400).json({ error: "Quality must be in range 1..3" });

  const matched = req.body.url?.match(platformRegex[platform]);
  if (!matched)
    return res.status(400).json({
      error: "Provided URL is not a valid " + platform + " URL.",
    });

  const dir = path.join(process.cwd(), "media", platform, matched[1] + quality);

  if (fs.existsSync(dir)) {
    fs.writeFileSync(dir + "/.lastaccessed", Date.now().toString());
    return res.send(fs.readFileSync(dir + "/.items"));
  }

  let links = await getItems[platform](req.body.url, quality / 3, matched[1]);

  if (!Array.isArray(links))
    return res.status(links.code).send({ error: links.msg });
  links = links?.filter(Boolean);

  if (!links.length)
    return res.status(404).json({
      error: "No media files found against provided URL.",
    });

  fs.mkdirSync(dir);
  fs.writeFileSync(dir + "/.lastaccessed", Date.now().toString());

  downloadItems(links, platform, matched[1] + quality, res);
}

export { main };
