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
                                          years,

                                          peopleMap,
                                          worksMap,
                                          companiesMap,
                                          publishersMap,
                                          yearsMap,

                                          interviews
                                      }) {

    const archiveLastMod = getLastModified(interviews);

    const urls = [
        { loc: "", lastmod: archiveLastMod },
        { loc: "people/", lastmod: archiveLastMod },
        { loc: "works/", lastmod: archiveLastMod },
        { loc: "companies/", lastmod: archiveLastMod },
        { loc: "publishers/", lastmod: archiveLastMod },
        { loc: "years/", lastmod: archiveLastMod },
    ];

    function addSection(base, dictionary, map) {
        for (const slug of Object.keys(dictionary)) {
            urls.push({
                loc: `${base}/${slug}.html`,
                lastmod: getLastModified(map.get(slug))
            });
        }
    }

    addSection("people", people, peopleMap);
    addSection("works", works, worksMap);
    addSection("companies", companies, companiesMap);
    addSection("publishers", publishers, publishersMap);
    addSection("years", years, yearsMap);

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