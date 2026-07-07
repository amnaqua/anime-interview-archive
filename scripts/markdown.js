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

        if (interview.studio.length)
            md += `- **Studio:** ${interview.studio.join(", ")}\n`;

        if (interview.url)
            md += `- **Source:** ${interview.url}\n`;

        md += "\n---\n\n";
    }

    return md;
}