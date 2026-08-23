import DefaultTheme from "vitepress/theme";
import "./custom.css";
import { activateTabForHash } from "./tabs.js";

export default {
    extends: DefaultTheme,
    enhanceApp({ router }) {
        if (typeof window === "undefined")
            return;

        const run = () => {
            // Wait for the new page content to render.
            requestAnimationFrame(activateTabForHash);
        };

        router.onAfterRouteChanged = run;
    }
};
