import fs from "fs/promises";
import path from "path";
import { formatRecordList } from "./record-list.js";

const ROOT = "docs";

export async function generateHome(stats) {

    const articles = stats.articles ?? 0;
    const productionMaterials = stats.productionMaterials ?? 0;
    const artworks = stats.artworks ?? 0;
    const totalRecords =
        stats.interviews +
        articles +
        productionMaterials +
        artworks;

    let md = `---
layout: home

hero:
  name: Anime Interview Archive
  text: Archive of anime and manga staff interviews.
  tagline: ${totalRecords} records indexed

features:
  - title: 👥 People
    details: ${stats.people} people
    link: /people/

  - title: 🎬 Works
    details: ${stats.works} works
    link: /works/

  - title: 🏢 Companies
    details: ${stats.companies} companies
    link: /companies/

  - title: 📰 Publishers
    details: ${stats.publishers} publishers
    link: /publishers/
---

# Recently Added

<p class="home-type-stats">🎤 ${stats.interviews} interviews · 📰 ${articles} articles · 📄 ${productionMaterials} production materials · 🎨 ${artworks} artworks</p>

`;

    md += formatRecordList(stats.latestRecords);

    await fs.writeFile(
        path.join(ROOT, "index.md"),
        md
    );
}