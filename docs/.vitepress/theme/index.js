import DefaultTheme from "vitepress/theme";
import "./custom.css";
import { activateTabForHash } from "./tabs.js";
import { initReadTracking } from "./read.js";

export default {
    extends: DefaultTheme,
    enhanceApp({ router }) {
        if (typeof window === "undefined")
            return;

        const run = () => {
            requestAnimationFrame(() => {
                activateTabForHash();
                initReadTracking();
            });
        };

        router.onAfterRouteChanged = run;
        run();
    }
};
