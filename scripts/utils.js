import fs from "fs/promises";

export function lookup(dict, slug) {
    return dict?.[slug]?.name ?? slug;
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