import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);


const ROOT =
    path.resolve(
        __dirname,
        "../../../"
    );

function slugify(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

export async function generateInterview(data) {
    const year = new Date(data.date).getFullYear();

    const slug = `${data.date}-${slugify(data.title)}`;

    const dir =
        path.resolve(
            ROOT,
            "interviews",
            String(year)
        );

    await fs.mkdir(
        dir,
        {
            recursive:true
        }
    );

    const filepath =
        path.join(
            dir,
            `${slug}.md`
        );

    const markdown =
        `---
title: "${data.title}"

date: ${data.date}

people:
${data.people.map(x => `  - ${x}`).join("\n")}

media_type: ${data.media_type}

companies:
${data.companies.map(x => `  - ${x}`).join("\n")}

publisher:
${data.publisher.map(x => `  - ${x}`).join("\n")}

work:
${data.work.map(x => `  - ${x}`).join("\n")}

language: ${data.language}

links:
${data.links.map(link => `  - type: ${link.type} url: ${link.url}`).join("\n")}

archived_at: ${data.archived_at}

type: interview
---
`;

    await fs.writeFile(
        filepath,
        markdown,
        "utf8"
    );

    return {
        filename:`${slug}.md`,
        path:`interviews/${year}/${slug}.md`
    };
}