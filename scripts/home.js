import fs from "fs/promises";
import path from "path";

const ROOT = "docs";

export async function generateHome(stats) {

    let md = `---
layout: home

hero:
  name: Anime Interview Archive
  text: Archive of anime staff interviews and production materials.
  tagline: ${stats.interviews} interviews indexed

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

<div style="margin-top: 2rem;"></div>

# Recently Added

`;

    for (const interview of stats.latestInterviews) {
        const people = interview.peopleNames.join(", ");

        md += `- **${interview.archived_at}** — **${people}** — [${interview.title}](/people/${interview.people[0]}#${interview.anchor})\n`;
    }

    await fs.writeFile(
        path.join(ROOT, "index.md"),
        md
    );
}