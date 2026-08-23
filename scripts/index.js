import fs from "fs/promises";
import path from "path";
import { getDisplayName, getDuplicateNames } from "./utils.js";

export async function generateIndex(directory, title, dictionary) {

    let md = `---
title: ${title}
---

# ${title}

`;

    const duplicates = getDuplicateNames(dictionary);

    const items = Object.entries(dictionary)
        .sort((a, b) => a[1].name.localeCompare(b[1].name));

    for (const [slug, value] of items) {
        md += `- [${getDisplayName(value, duplicates)}](./${slug})\n`;
    }

    await fs.writeFile(
        path.join(directory, "index.md"),
        md
    );
}
