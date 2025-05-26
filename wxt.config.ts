import {defineConfig} from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
    srcDir: "src",
    modules: ["@wxt-dev/module-svelte"],
    manifest: {
        permissions: [
            "activeTab",
            "scripting",
            "storage"
        ],
        host_permissions: [
            "https://*.linkedin.com/*",
            "https://linkedin.com/*",
            "https://ind.nl"
        ],
        content_security_policy: {
            extension_pages: "script-src 'self'; object-src 'self';"
        }
    }
});
