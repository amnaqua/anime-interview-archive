import fs from "fs/promises";
import path from "path";

const ROOT = "docs";
const BASE_URL = "https://amnaqua.github.io/anime-interview-archive";

function getLastModified(interviews = []) {

    return interviews
        .filter(i => i.archived_at)
        .reduce((latest, interview) => {

            const date = interview.archived_at.slice(0, 10);

            return !latest || date > latest
                ? date
                : latest;

        }, null);
}

export async function generateSitemap({
                                          people,
                                          works,
                                          companies,
                                          publishers,
                                          peopleMap,
                                          worksMap,
                                          companiesMap,
                                          publishersMap,
                                          interviews
                                      }) {

    const urls = [];

    const archiveLastMod = getLastModified(interviews);

    urls.push({
        loc: "",
        lastmod: archiveLastMod
    });

    urls.push({
        loc: "people/",
        lastmod: archiveLastMod
    });

    urls.push({
        loc: "works/",
        lastmod: archiveLastMod
    });

    urls.push({
        loc: "companies/",
        lastmod: archiveLastMod
    });

    urls.push({
        loc: "publishers/",
        lastmod: archiveLastMod
    });

    for (const slug of Object.keys(people)) {
        urls.push({
            loc: `people/${slug}.html`,
            lastmod: getLastModified(peopleMap.get(slug))
        });
    }

    for (const slug of Object.keys(works)) {
        urls.push({
            loc: `works/${slug}.html`,
            lastmod: getLastModified(worksMap.get(slug))
        });
    }

    for (const slug of Object.keys(companies)) {
        urls.push({
            loc: `companies/${slug}.html`,
            lastmod: getLastModified(companiesMap.get(slug))
        });
    }

    for (const slug of Object.keys(publishers)) {
        urls.push({
            loc: `publishers/${slug}.html`,
            lastmod: getLastModified(publishersMap.get(slug))
        });
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls.map(url => `  <url>
    <loc>${BASE_URL}/${url.loc}</loc>${url.lastmod ? `
    <lastmod>${url.lastmod}</lastmod>` : ""}
  </url>`).join("\n")}

</urlset>
`;

    await fs.writeFile(
        path.join(ROOT, "public", "sitemap.xml"),
        xml
    );
}