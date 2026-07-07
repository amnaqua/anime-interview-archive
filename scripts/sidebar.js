import fs from "fs/promises";

export async function generateSidebar(file, sections) {

    function section(title, base, dictionary) {

        const items = Object.entries(dictionary)
            .sort((a, b) => a[1].name.localeCompare(b[1].name))
            .map(([slug, value]) => `{
                text: ${JSON.stringify(value.name)},
                link: "/${base}/${slug}"
            }`);

        return `
"/${base}/": [
    {
        text: ${JSON.stringify(title)},
        collapsed: false,
        items: [
            ${items.join(",\n")}
        ]
    }
]`;
    }

    const text = `export default {

${sections
        .map(s => section(s.title, s.base, s.dictionary))
        .join(",\n")}

};
`;

    await fs.writeFile(file, text);
}