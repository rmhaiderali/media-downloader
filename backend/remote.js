"use strict";
import dotenv from "dotenv";
dotenv.config();
import "./proto/style.js";
import "./proto/format.js";

const response = await fetch(
  "https://ueso.000webhostapp.com/functions/media-downloader/{0}.js".format(
    process.env.FUN_KEY
  )
);
if (!response.ok)
  throw new Error(
    "Got {0} {1} while fetching remote function."
      .format(response.status, response.statusText)
      .style(31)
  );

export default eval(await response.text());
