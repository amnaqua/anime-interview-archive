import fs from "fs/promises";

export function lookup(dict, slug) {
    return dict?.[slug]?.name ?? slug;
}

export function getDuplicateNames(dictionary) {
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

export function getDisplayName(entity, duplicates) {
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

export function entryAnchorId(anchor) {
    return `entry-${anchor}`;
}

export function recordIdFromFile(file) {
    return file
        .replace(/^interviews[/\\]/, "")
        .replace(/\.md$/, "")
        .replace(/\\/g, "/");
}

export async function resetDirectory(dir) {
    await fs.rm(dir, {
        recursive: true,
        force: true
    });

    await fs.mkdir(dir, {
        recursive: true
    });
}

export function addToMap(map, key, interview) {

    if (!key) return;

    if (!map.has(key))
        map.set(key, []);

    const list = map.get(key);

    if (!list.includes(interview)) {
        list.push(interview);
    }
}