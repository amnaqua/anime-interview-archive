import {
    peopleLinks,
    workLinks,
    companyLinks,
    publisherLinks
} from "./links.js";
import { entryAnchorId } from "./utils.js";

export function buildMarkdown({
                                  entity,
                                  interviews = [],
                                  articles = [],
                                  productionMaterials = [],
                                  artworks = []
                              }) {

    const title = entity.name;

    let md = `---
title: "${title}"
---

# ${title}

`;

    md += `<div class="entity-meta">\n`;

    if (entity.type || entity.year) {

        const parts = [];

        if (entity.type) {
            parts.push(
                entity.type.charAt(0).toUpperCase() +
                entity.type.slice(1)
            );
        }

        if (entity.year) {
            parts.push(entity.year);
        }

        md += `<div>${parts.join(" • ")}</div>\n`;
    }

    if (entity.aliases?.length) {
        md += `<div class="entity-aliases">${entity.aliases.join(" • ")}</div>\n`;
    }

    if (entity.roles?.length) {
        md += `<div class="entity-roles">Jobs: ${entity.roles.join(", ")}</div>\n`;
    }

    md += `</div>\n\n`;

    md += `
<div class="entity-tabs">

<button class="entity-tab active" data-tab="interviews">
Interviews (${interviews.length})
</button>

<button class="entity-tab" data-tab="articles">
Articles (${articles.length})
</button>

<button class="entity-tab" data-tab="materials">
Production Materials (${productionMaterials.length})
</button>

<button class="entity-tab" data-tab="artworks">
Artworks (${artworks.length})
</button>

</div>

<div id="interviews" class="entity-section active">
`;

    md += renderItems(interviews, "Interviews");

    md += `
</div>

<div id="articles" class="entity-section">
`;

    md += renderItems(articles, "Articles");

    md += `
</div>

<div id="materials" class="entity-section">
`;

    md += renderItems(
        productionMaterials,
        "Production Materials"
    );

    md += `
</div>

<div id="artworks" class="entity-section">
`;

    md += renderItems(
        artworks,
        "Artworks"
    );

    md += `
</div>
`;

    return md;
}

function renderItems(items, title) {

    items.sort((a, b) => {

        if (a.date === "Unknown" && b.date === "Unknown")
            return 0;

        if (a.date === "Unknown")
            return 1;

        if (b.date === "Unknown")
            return -1;

        return b.date.localeCompare(a.date);

    });

    let md = "";

    if (!items.length) {

        md += `No ${title.toLowerCase()} available yet.\n\n`;

        return md;
    }

    md += `\n\n`;

    for (const interview of items) {

        md += `<div class="record-entry" data-record-id="${interview.id}">\n\n`;
        md += `### ${interview.title} {#${entryAnchorId(interview.anchor)}}\n\n`;

        md += `- **Date:** ${interview.date ?? "Unknown"}\n`;

        if (interview.work?.length)
            md += `- **Works:** ${workLinks(interview).join(", ")}\n`;

        if (interview.mediaType)
            md += `- **Media Type:** ${interview.mediaType}\n`;

        if (interview.publishers?.length)
            md += `- **Publisher:** ${publisherLinks(interview).join(", ")}\n`;

        if (interview.language)
            md += `- **Language:** ${interview.language}\n`;

        if (interview.companies?.length)
            md += `- **Companies:** ${companyLinks(interview).join(", ")}\n`;

        if (interview.people?.length)
            md += `- **People:** ${peopleLinks(interview).join(", ")}\n`;

        const sourceLinks = interview.links.filter(
            link => link.type === "source"
        );

        if (sourceLinks.length) {

            md += "- **Source:**";

            let i = 0;

            for (const link of sourceLinks) {

                if (link.label) {

                    if (i === 0)
                        md += "\n";

                    md += `  - ${link.label}: ${link.url}\n`;

                } else {

                    md += `  ${link.url}\n`;

                }

                i++;
            }

        }

        const translations = interview.links.filter(
            link => link.type === "translation"
        );

        if (translations.length) {

            md += "- **Translations:**\n";

            for (const link of translations) {
                md += `  - ${link.language}: ${link.url}\n`;
            }

        }

        if (interview.entries?.length) {

            md += `<details>\n`;
            md += `<summary><strong>Contents (${interview.entries.length})</strong></summary>\n\n`;

            md += `| Date | Publisher | Interview |\n`;
            md += `|------|-----------|-----------|\n`;

            for (const entry of interview.entries) {
                md += `| ${entry.date} | ${entry.publisher ?? ""} | ${entry.title} |\n`;
            }

            md += `\n</details>\n\n`;

        }

        md += `\n</div>\n\n---\n\n`;
    }

    return md;
}