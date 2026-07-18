import { addToMap } from "./utils.js";

function indexEntries(entries, map, field, interview) {

    for (const entry of entries ?? []) {

        const value = entry[field];

        if (!value) continue;

        if (Array.isArray(value)) {
            for (const slug of value) {
                addToMap(map, slug, interview);
            }
        } else {
            addToMap(map, value, interview);
        }
    }
}

export function indexInterview({
                                   interview,
                                   data,
                                   people,
                                   works,
                                   companies,
                                   publishers,
                                   years
                               }) {

    for (const slug of interview.people)
        addToMap(people, slug, interview);

    for (const slug of interview.work)
        addToMap(works, slug, interview);

    for (const slug of data.companies ?? [])
        addToMap(companies, slug, interview);

    for (const slug of data.publisher ?? [])
        addToMap(publishers, slug, interview);

    const year =
        interview.date === "Unknown"
            ? "unknown"
            : interview.date.slice(0, 4);

    addToMap(years, year, interview);

    indexEntries(data.entries, people, "people", interview);
    indexEntries(data.entries, works, "work", interview);
    indexEntries(data.entries, publishers, "publisher", interview);
}