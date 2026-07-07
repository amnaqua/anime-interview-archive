import { defineConfig } from "vitepress";
import sidebar from "./sidebar";

export default defineConfig({
    base: "/anime-interview-archive/",

    lang: "en-US",

    title: "Anime Interview Archive",
    description: "Archive of anime staff interviews",

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
                    { text: "Publishers", link: "/publishers/" }
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