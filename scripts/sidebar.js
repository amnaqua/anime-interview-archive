import fs from "fs/promises";
import { getDisplayName, getDuplicateNames } from "./utils.js";

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
