import { allowedDomains } from "../constants/app.constants.js";

export default function (req, res, next) {
  res.header(
    "Cross-Origin-Resource-Policy",
    allowedDomains.includes(req.headers.referer?.slice(0, -1))
      ? "cross-origin"
      : "same-origin"
  );
  next();
}
