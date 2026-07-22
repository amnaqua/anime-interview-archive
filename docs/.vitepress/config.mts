import { defineConfig } from "vitepress";
import sidebar from "./sidebar";

export default defineConfig({
    base: "/anime-interview-archive/",

    lang: "en-US",

    title: "Animanga Interview Archive",
    description: "Archive of anime and manga staff interviews",

    head: [
        [
            "link",
            {
                rel: "icon",
                href: "/anime-interview-archive/favicon.svg"
            },
            "script",
            {
                src: "//gc.zgo.at/count.js",
                async: "",
                "data-goatcounter":
                    "https://anime-interview-archive.goatcounter.com/count"
            }
        ]
    ],

    themeConfig: {
        sidebar,

        search: {
            provider: "local"
        },

        nav: [
            {
                text: "Browse",
                items: [
                    { text: "People", link: "/people/" },
                    { text: "Works", link: "/works/" },
                    { text: "Companies", link: "/companies/" },
                    { text: "Publishers", link: "/publishers/" },
                    { text: "Years", link: "/years/" }
                ]
            }
        ],

        socialLinks: [
            {
                icon: "github",
                link: "https://github.com/amnaqua"
            }
        ]
    }
});