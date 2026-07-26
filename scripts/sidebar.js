import fs from "fs/promises";

function getDuplicateNames(dictionary) {
    const counts = new Map();

    for (const entity of Object.values(dictionary)) {
        counts.set(
            entity.name,
            (counts.get(entity.name) ?? 0) + 1
        );
    }

    return counts;
}

function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function getDisplayName(entity, duplicates) {
    if ((duplicates.get(entity.name) ?? 0) <= 1) {
        return entity.name;
    }

    const details = [];

    if (entity.type) {
        details.push(capitalize(entity.type));
    }

    if (entity.year) {
        details.push(entity.year);
    }

    return `${entity.name} (${details.join(", ")})`;
}

export async function generateSidebar(file, sections) {

    function section(title, base, dictionary) {

        const duplicates = getDuplicateNames(dictionary);

        const items = Object.entries(dictionary)
            .sort((a, b) => a[1].name.localeCompare(b[1].name))
            .map(([slug, value]) => ({
                text: getDisplayName(value, duplicates),
                link: `/${base}/${slug}`,
            }));

        return `"/${base}/": ${JSON.stringify(
            [
                {
                    text: title,
                    collapsed: false,
                    items,
                },
            ],
            null,
            4
        )}`;
    }

    const text = `export default {

${sections
        .map(s => section(s.title, s.base, s.dictionary))
        .join(",\n")}

};
`;

    await fs.writeFile(file, text);
}