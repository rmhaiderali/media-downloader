import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const stringer = (str) => "\"" + str + "\"";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    SERVER: stringer(
      [
        "/",
        "http://localhost:3001/",
        "http://159.223.36.123:3001/",
        "https://ueso.000webhostapp.com/",
      ][3]
    ),
  },
});
