export default function (req, res, next) {
  if (req.query.download === "1") {
    const filename = decodeURI(req.path).split("/").slice(1).join(" ");
    res.set(
      "Content-Disposition",
      "attachment; filename=" + JSON.stringify(filename)
    );
  }
  next();
}
