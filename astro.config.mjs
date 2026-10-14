import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://brand.rjmlaird.co.uk",
  trailingSlash: "always",
  build: { format: "directory" },
});
