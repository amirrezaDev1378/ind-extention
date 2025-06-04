import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
// import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-svelte", "@wxt-dev/auto-icons"],

  manifest: {
    description:
      " A browser extension that helps jobseekers and recruiters on LinkedIn quickly identify companies recognized by the Dutch Immigration and Naturalisation Service (IND) as visa sponsors for regular labor and highly skilled migrants. ",
    name: "IND Extension",

    permissions: ["activeTab", "scripting", "storage"],
    host_permissions: [
      "https://*.linkedin.com/*",
      "https://linkedin.com/*",
      "https://raw.githubusercontent.com/amirrezaDev1378/ind-extention/*",
    ],

    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self';",
    },
  },
  webExt: {
    startUrls: [
      "https://www.linkedin.com/jobs/search?keywords=&location=Netherlands&geoId=102890719&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0",
    ],
    openDevtools: true,
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  svelte: {
    vite: {
      emitCss: false,
    },
  },
});
