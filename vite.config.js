import "dotenv/config.js"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

const stringer = (target) =>
  typeof target === "string" ? '"' + target + '"' : target

const base = process.env.BASE || ["/", "/media_downloader/"][0]
const proxy = process.env.PROXY || [false, "https://example.com/proxy.php"][0]
const server = process.env.SERVER || ["/", "https://example.com/"][0]

// https://vitejs.dev/config/
export default defineConfig({
  base,
  root: "./frontend",
  publicDir: "../public",
  plugins: [react()],
  build: {
    target: "es6",
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: "/index.html",
        experimental: "/experimental/index.html"
      }
    }
  },
  define: {
    BASE: stringer(base),
    PROXY: stringer(proxy),
    SERVER: stringer(server)
  }
})
