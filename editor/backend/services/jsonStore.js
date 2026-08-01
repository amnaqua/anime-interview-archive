import fs from "fs/promises";
import path from "path";

export async function readJson(file){
    const data =
        await fs.readFile(
            path.resolve(file),
            "utf8"
        );

    return JSON.parse(data);
}

export async function writeJson(file, data){
    let json =
        JSON.stringify(
            data,
            null,
            2
        );

    json = json.replace(/},\n  "/g, "},\n\n  \"");

    await fs.writeFile(
        path.resolve(file),
        json,
        "utf8"
    );
}