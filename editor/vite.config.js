import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
    root: "frontend",

    plugins: [
        vue()
    ],

    server: {
        port: 5173
    },

    resolve: {
        alias: {
            "@": path.resolve(
                __dirname,
                "frontend/src"
            )
        }
    }
});