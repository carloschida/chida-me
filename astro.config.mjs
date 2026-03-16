import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import astroExpressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import ecTwoSlash from "expressive-code-twoslash";
import remarkReadingTime from "remark-reading-time";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  adapter: cloudflare(),

  build: {
    inlineStylesheets: "always",
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    sitemap(),
    icon(),
    astroExpressiveCode({
      plugins: [ecTwoSlash()],
    }),
    mdx(),
  ],

  markdown: {
    remarkPlugins: [
      remarkReadingTime,
      () => {
        return function (_tree, file) {
          file.data.astro.frontmatter.minutesRead =
            file.data.readingTime.minutes;
        };
      },
    ],
  },


  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },

  site: "https://chida.me",

  vite: {
    plugins: [tailwindcss()],
  },
});
