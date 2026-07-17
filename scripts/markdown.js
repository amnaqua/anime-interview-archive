export function buildMarkdown({ entity, interviews }) {

    const title = entity.name;

    interviews.sort((a, b) => {
        if (a.date === "Unknown" && b.date === "Unknown") return 0;
        if (a.date === "Unknown") return 1;
        if (b.date === "Unknown") return -1;

        return b.date.localeCompare(a.date);
    });

    let md = `---
title: "${title}"
---

# ${title}

`;
    const meta = [];

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

        meta.push(parts.join(" • "));
    }

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

    md += `## Interviews\n\n`;

    if (interviews.length === 0) {
        md += "No interviews available yet.\n";
        return md;
    }

    for (const interview of interviews) {

        md += `### ${interview.title}\n\n`;

        if (interview.date) {
            md += `- **Date:** ${interview.date}\n`;
        } else {
            md += `- **Date:** Unknown\n`;
        }

        if (interview.work.length) {
            md += `- **Works:** ${interview.work.join(", ")}\n`;
        }

        if (interview.mediaType) {
            md += `- **Media Type:** ${interview.mediaType}\n`
        }

        if (interview.publisher.length)
            md += `- **Publisher:** ${interview.publisher.join(", ")}\n`;

        if (interview.language)
            md += `- **Language:** ${interview.language}\n`;

        if (interview.companies.length)
            md += `- **Companies:** ${interview.companies.join(", ")}\n`;

        if (interview.peopleNames.length)
            md += `- **Peoples:** ${interview.peopleNames.join(", ")}\n`

        const sourceLinks = interview.links.filter(
            link => link.type === "source"
        );

        if (sourceLinks.length) {
            md += "- **Source:**";

            let i = 0;
            for (const link of sourceLinks) {
                if (link.label) {
                    if (i === 0) {
                        md += '\n'
                    }

                    md += `  - ${link.label}: ${link.url}\n`;
                }
                else
                    md += `  ${link.url}\n`;
                ++i;
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

        md += "\n---\n\n";
    }

    return md;
}