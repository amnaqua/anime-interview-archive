import fs from "fs/promises";
import path from "path";
import { entryAnchorId } from "./utils.js";

const ROOT = "docs";

function recordUrl(record) {
    const hash = entryAnchorId(record.anchor);

    if (record.people?.length) {
        return `/people/${record.people[0]}#${hash}`;
    }

    if (record.work?.length) {
        return `/works/${record.work[0]}#${hash}`;
    }

    if (record.companies?.length) {
        return `/companies/${record.companies[0]}#${hash}`;
    }

    if (record.publishers?.length) {
        return `/publishers/${record.publishers[0]}#${hash}`;
    }

    return "#";
}

function recordLabel(record) {

    if (record.peopleNames?.length) {
        return record.peopleNames.join(", ");
    }

    if (record.companyNames?.length) {
        return record.companyNames.join(", ");
    }

    if (record.publisherNames?.length) {
        return record.publisherNames.join(", ");
    }

    if (record.workNames?.length) {
        return record.workNames.join(", ");
    }

    return null;
}

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

<p class="home-type-stats">
  <span>${stats.interviews} interviews</span>
  <span>${articles} articles</span>
  <span>${productionMaterials} production materials</span>
  <span>${artworks} artworks</span>
</p>

# Recently Added

`;

    for (const record of stats.latestRecords) {
        const icon =
            record.type === "article"
                ? "📰"
                : record.type === "production_material"
                    ? "📄"
                    : record.type === "artwork"
                        ? "🎨"
                        : "🎤";

        const label = recordLabel(record);

        md += `- **${record.archived_at}** ${icon}${label ? ` ${label}` : ""} — [${record.title}](${recordUrl(record)})\n`;
    }

    await fs.writeFile(
        path.join(ROOT, "index.md"),
        md
    );
}