export default function (req, res, next) {
  if (req.query.download === "1")
    res.set("Content-Type", "application/octet-stream")
  next()
}
