export function buildMarkdown({ entity, interviews }) {

    const title = entity.name;

    interviews.sort((a, b) => b.date.localeCompare(a.date));

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

    if (entity.aliases?.length) {
        meta.push(entity.aliases.join(" • "));
    }

    if (entity.roles?.length) {
        meta.push(`Jobs: ${entity.roles.join(", ")}`);
    }

    if (meta.length) {
        md += `<div class="entity-meta">\n`;

        for (const line of meta) {
            md += `${line}<br>\n`;
        }

        md += `</div>\n\n`;
    }

    md += `## Interviews\n\n`;

    if (interviews.length === 0) {
        md += "No interviews available yet.\n";
        return md;
    }

    for (const interview of interviews) {

        md += `### ${interview.title}\n\n`;

        if (interview.date) {
            md += `- **Date:** ${interview.date}\n`;
        }

        if (interview.publisher.length)
            md += `- **Publisher:** ${interview.publisher.join(", ")}\n`;

        if (interview.language)
            md += `- **Language:** ${interview.language}\n`;

        if (interview.companies.length)
            md += `- **Company:** ${interview.companies.join(", ")}\n`;

        if (interview.peopleNames.length)
            md += `- **People:** ${interview.peopleNames.join(", ")}\n`

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