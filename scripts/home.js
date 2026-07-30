import fs from "fs/promises";
import path from "path";

const ROOT = "docs";

function recordUrl(record) {

    if (record.people?.length) {
        return `/people/${record.people[0]}#${record.anchor}`;
    }

    if (record.work?.length) {
        return `/works/${record.work[0]}#${record.anchor}`;
    }

    if (record.companies?.length) {
        return `/companies/${record.companies[0]}#${record.anchor}`;
    }

    if (record.publishers?.length) {
        return `/publishers/${record.publishers[0]}#${record.anchor}`;
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

    const totalRecords =
        stats.interviews +
        (stats.articles ?? 0) +
        (stats.productionMaterials ?? 0) +
        (stats.artworks ?? 0)

    let md = `---
layout: home

hero:
  name: Anime Interview Archive
  text: Archive of anime and manga staff interviews.
  tagline: ${totalRecords} records indexed

features:
  - title: 🎤 Interviews
    details: ${stats.interviews} interviews

  - title: 📰 Articles
    details: ${stats.articles ?? 0} articles

  - title: 📄 Production Materials
    details: ${stats.productionMaterials ?? 0} materials
    
  - title: 🎨 Artworks
    details: ${stats.artworks ?? 0} artworks

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

<div style="margin-top: 2rem;"></div>

# Recently Added

`;

    for (const record of stats.latestRecords) {
        const icon =
            record.type === "article"
                ? "📰"
                : record.type === "production_material"
                    ? "📄"
                    : record.type === "artworks"
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