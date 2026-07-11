export function buildMarkdown({ entity, interviews }) {

    const title = entity.name;

    interviews.sort((a, b) => b.date.localeCompare(a.date));

    let md = `---
title: "${title}"
---

# ${title}

`;
    if (entity.aliases?.length) {
        md += `${entity.aliases.join(" • ")}\n\n`;
    }

    if (entity.roles?.length) {
        md += `**Roles:** ${entity.roles.join(", ")}\n\n`;
    }

    md += `## Interviews\n\n`;

    if (interviews.length === 0) {
        md += "No interviews available yet.\n";
        return md;
    }

    for (const interview of interviews) {

        md += `### ${interview.title}\n\n`;

        md += `- **Date:** ${interview.date}\n`;

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

        md += "\n---\n\n";
    }

    return md;
}