import { entryAnchorId } from "./utils.js";

export function recordUrl(record) {
    const hash = entryAnchorId(record.anchor);

    if (record.people?.length) {
        return `/people/${record.people[0]}#${hash}`;
    }

    if (record.work?.length) {
        return `/works/${record.work[0]}#${hash}`;
    }

    if (record.companies?.length) {
        return `/companies/${record.companies[0]}#${hash}`;
    }

    if (record.publishers?.length) {
        return `/publishers/${record.publishers[0]}#${hash}`;
    }

    return "#";
}

export function recordLabel(record) {
    if (record.peopleNames?.length) {
        return record.peopleNames.join(", ");
    }

    if (record.companyNames?.length) {
        return record.companyNames.join(", ");
    }

    if (record.publisherNames?.length) {
        return record.publisherNames.join(", ");
    }

    if (record.workNames?.length) {
        return record.workNames.join(", ");
    }

    return null;
}

export function recordIcon(record) {
    if (record.type === "article") {
        return "📰";
    }

    if (record.type === "production_material") {
        return "📄";
    }

    if (record.type === "artwork") {
        return "🎨";
    }

    return "🎤";
}

export function formatRecordLine(record) {
    const icon = recordIcon(record);
    const label = recordLabel(record);

    return `- **${record.archived_at}** ${icon}${label ? ` ${label}` : ""} — [${record.title}](${recordUrl(record)})\n`;
}

export function sortByArchivedAt(records) {
    return records
        .filter(record => record.archived_at)
        .sort(
            (a, b) =>
                new Date(b.archived_at) -
                new Date(a.archived_at)
        );
}
