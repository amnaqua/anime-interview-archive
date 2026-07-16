import fs from "fs/promises";
import path from "path";

const ROOT = "docs";
const BASE_URL = "https://amnaqua.github.io/anime-interview-archive";

export async function generateRobots() {

    const robots = `User-agent: *

Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;

    await fs.writeFile(
        path.join(ROOT, "public", "robots.txt"),
        robots
    );
}