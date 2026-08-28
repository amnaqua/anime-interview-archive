import fs from "fs/promises";
import path from "path";
import { formatRecordList, sortByArchivedAt } from "./record-list.js";

const ROOT = "docs";

export async function generateFeed({ records, counts }) {
    const sorted = sortByArchivedAt(records);

    let md = `---
title: Archive Feed
---

# Archive Feed

<p class="home-type-stats">🎤 ${counts.interviews} interviews · 📰 ${counts.articles} articles · 📄 ${counts.productionMaterials} production materials · 🎨 ${counts.artworks} artworks</p>

`;

    md += formatRecordList(sorted);

    await fs.mkdir(
        path.join(ROOT, "feed"),
        { recursive: true }
    );

    await fs.writeFile(
        path.join(ROOT, "feed", "index.md"),
        md
    );
}
