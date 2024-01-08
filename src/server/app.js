import express from "express";
import cors from "cors";
import setContentType from "./middlewares/setContentType.middleware.js";
import setCORPHeader from "./middlewares/setCORPHeader.middleware.js";
import mediaRoutes from "./routes/media.routes.js";

const app = express();

app.use(cors());
app.use(express.text({ type: ["text/plain", "application/json"] }));
app.use(setCORPHeader);

app.use("/api/v1/media", mediaRoutes);

app.use("/media", setContentType, express.static("media"));

export default app;
