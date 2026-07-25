import fs from "fs/promises";
import path from "path";

const slug = process.argv[2];

if (!slug) {
    console.error(
        "Usage: npm run create -- 2009-06-19-ann-industry-tomino"
    );
    process.exit(1);
}

function now() {
    const date = new Date();

    const pad = value =>
        String(value).padStart(2, "0");

    return (
        `${date.getFullYear()}-` +
        `${pad(date.getMonth() + 1)}-` +
        `${pad(date.getDate())} ` +
        `${pad(date.getHours())}:` +
        `${pad(date.getMinutes())}`
    );
}

const match = slug.match(/^(\d{4})-(\d{2})-(\d{2})/);

if (!match) {
    console.error(
        "Filename must start with YYYY-MM-DD"
    );
    process.exit(1);
}

const year = match[1];

const dir = path.join(
    "interviews",
    year
);

const filePath = path.join(
    dir,
    `${slug}.md`
);

await fs.mkdir(dir, {
    recursive: true
});

try {
    await fs.access(filePath);

    console.error(
        `File already exists: ${filePath}`
    );

    process.exit(1);

} catch {
    // file not exists
}

const template = `---
title: ""

date: ${match[0]}
archived_at: ${now()}

language: ja
media_type:

people: []
work: []
companies: []
publisher: []

links:
  - type: source
    label:
    url:

entries:
  - title:
    date:
    people: []
    work: []
    publisher:
---

`;

await fs.writeFile(
    filePath,
    template
);

console.log(
    `Created: ${filePath}`
);