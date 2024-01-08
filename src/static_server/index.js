import cors from "cors";
import express from "express";
import fallback from "express-history-api-fallback";

// import url from "url"
// import path from "path"
// const __filename = url.fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

const app = express();
app.use(cors());
app.use(express.static("dist"));
app.use(
  "/experimental",
  fallback("index.html", { root: process.cwd() + "/dist/experimental" })
);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log("listening on port " + PORT));
