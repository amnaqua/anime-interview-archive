export function buildMarkdown(title, interviews) {

    interviews.sort((a, b) => b.date.localeCompare(a.date));

    let md = `---
title: ${title}
---

# ${title}

## Interviews

`;

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

        const sourceLinks = interview.links.filter(
            link => link.type === "source"
        );

        if (sourceLinks.length) {
            md += "- **Source:**\n";

            for (const link of sourceLinks) {
                if (link.label)
                    md += ` - ${link.label}: ${link.url}\n`;
                else
                    md += ` ${link.url}\n`;
            }
        }

        const translations = interview.links.filter(
            link => link.type === "translation"
        );

        if (translations.length) {
            md += "- **Translations:**\n";

            for (const link of translations) {
                md += ` - ${link.language}: ${link.url}\n`;
            }
        }

        md += "\n---\n\n";
    }

    return md;
}