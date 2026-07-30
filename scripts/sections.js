import fs from "fs/promises";
import path from "path";

import { resetDirectory } from "./utils.js";
import { buildMarkdown } from "./markdown.js";
import { generateIndex } from "./index.js";

export async function generateSection(section) {

    await resetDirectory(section.directory);

    await generateIndex(
        section.directory,
        section.title,
        section.dictionary
    );

    await Promise.all(
        Object.entries(section.dictionary)
            .map(async ([slug, entity]) => {

                const markdown = buildMarkdown({
                    slug,
                    entity,

                    interviews:
                        section.interviews.get(slug) ?? [],

                    articles:
                        section.articles.get(slug) ?? [],

                    productionMaterials:
                        section.productionMaterials.get(slug) ?? [],

                    artworks:
                        section.artworks.get(slug) ?? []
                });

                await fs.writeFile(
                    path.join(
                        section.directory,
                        `${slug}.md`
                    ),
                    markdown
                );
            })
    );
}