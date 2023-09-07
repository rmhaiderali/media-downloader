import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const stringer = (target) =>
  typeof target === "string" ? "\"" + target + "\"" : target;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    SERVER: stringer(
      ["/", "http://localhost:3001/", "http://159.223.36.123:3001/"][0]
    ),
    PROXY: stringer(
      [false, "/proxy.php", "https://ueso.000webhostapp.com/proxy.php"][0]
    ),
  },
});
