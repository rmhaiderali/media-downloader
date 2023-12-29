import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

const stringer = (target) =>
  typeof target === "string" ? "\"" + target + "\"" : target

const base = ["/", "/media_downloader/"][0]
const proxy = [false, "https://example.com/proxy.php"][0]
const server = ["/", "https://example.com/"][0]

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  build: {
    target: "es6",
    rollupOptions: {
      input: ["/index.html", "/experimental/index.html"]
    }
  },
  define: {
    BASE: stringer(base),
    PROXY: stringer(proxy),
    SERVER: stringer(server)
  }
})
