import "dotenv/config";

const site = process.env.GOATCOUNTER_SITE;
const apiKey = process.env.GOATCOUNTER_API_KEY;

const api = `https://${site}.goatcounter.com/api/v0`;

const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
};

async function request(url) {
    const response = await fetch(url, {
        headers
    });

    if (!response.ok) {
        throw new Error(
            `${response.status}: ${await response.text()}`
        );
    }

    return response.json();
}

function printLine(title, value) {
    console.log(
        `${title.padEnd(15)} ${value}`
    );
}

const total = await request(
    `${api}/stats/total`
);

console.log("\nAnime Interview Archive");
console.log("=======================");

printLine(
    "Total views:",
    total.total
);

printLine(
    "Events:",
    total.total_events
);

printLine(
    "UTC views:",
    total.total_utc
);

console.log("\nTop pages");
console.log("=======================");

const hits = await request(
    `${api}/stats/hits`
);

for (const page of hits.hits) {
    console.log(
        `${page.count.toString().padEnd(5)} ${page.path}`
    );

    console.log(
        `      ${page.title}`
    );
}