import fs from "fs/promises";
import fg from "fast-glob";

const INTERVIEW_DIR = "interviews";

async function main() {

    const files = await fg(
        `${INTERVIEW_DIR}/**/*.md`
    );

    let updated = 0;

    for (const file of files) {

        const content = await fs.readFile(
            file,
            "utf8"
        );

        if (!content.startsWith("---")) {
            continue;
        }

        const end = content.indexOf(
            "\n---",
            3
        );

        if (end === -1) {
            continue;
        }

        const frontmatter = content.slice(
            0,
            end
        );

        if (
            frontmatter.includes("\ntype:")
        ) {
            continue;
        }

        const updatedContent =
            content.slice(0, end)
            + "\ntype: interview"
            + content.slice(end);

        await fs.writeFile(
            file,
            updatedContent,
            "utf8"
        );

        updated++;

        console.log(
            `Updated: ${file}`
        );
    }

    console.log(
        `Done. Updated ${updated} files`
    );
}

main();