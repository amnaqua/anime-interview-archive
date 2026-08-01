import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);

const ROOT =
    path.resolve(
        __dirname,
        "../../../"
    );

export async function readJson(file) {
    const filename =
        path.resolve(
            ROOT,
            file
        );

    const data =
        await fs.readFile(
            filename,
            "utf8"
        );

    return JSON.parse(data);
}

export async function writeJson(file, data) {
    const filename =
        path.resolve(
            ROOT,
            file
        );

    let json =
        JSON.stringify(
            data,
            null,
            2
        );

    json =
        json.replace(
            /},\n  "/g,
            "},\n\n  \""
        );

    await fs.writeFile(
        filename,
        json,
        "utf8"
    );
}