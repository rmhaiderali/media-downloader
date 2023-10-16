import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

const stringer = (target) =>
  typeof target === "string" ? "\"" + target + "\"" : target

const proxy = [false, "https://ueso.000webhostapp.com/proxy.php"][0]
const server = ["/", "http://localhost:3001/", "http://159.223.36.123:3001/"][0]

// https://vitejs.dev/config/
export default defineConfig({
  base: "/experimental/",
  plugins: [react()],
  build: { target: "es6" },
  define: { PROXY: stringer(proxy), SERVER: stringer(server) }
})
