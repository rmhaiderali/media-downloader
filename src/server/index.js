"use strict";
import "dotenv/config.js";
import "./utils/ensureEnv.js";
import "./utils/cronJobs.js";
import ViteExpress from "vite-express";
import app from "./app.js";

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () =>
  console.log("server listening on port " + PORT)
);

ViteExpress.bind(app, server);
