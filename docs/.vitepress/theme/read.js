const STORAGE_KEY = "anime-interview-archive:read";

function getReadIds() {
    try {
        return new Set(
            JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
        );
    } catch {
        return new Set();
    }
}

function saveReadIds(ids) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...ids])
    );
}

function toggleRead(id) {
    const ids = getReadIds();

    if (ids.has(id)) {
        ids.delete(id);
    } else {
        ids.add(id);
    }

    saveReadIds(ids);

    return ids.has(id);
}

function updateToggleButton(button, read) {
    button.classList.toggle("is-read", read);
    button.setAttribute("aria-pressed", read ? "true" : "false");

    if (button.classList.contains("read-toggle--compact")) {
        button.textContent = read ? "✓" : "○";
        button.title = read ? "Mark as unread" : "Mark as read";
    } else {
        button.textContent = read ? "Read" : "Mark read";
    }
}

function findToggleButton(element) {
    return (
        element.querySelector(".read-toggle") ??
        element.closest(".record-feed li")?.querySelector(".read-toggle")
    );
}

function applyReadState() {
    const readIds = getReadIds();

    document.querySelectorAll("[data-record-id]").forEach(element => {
        const read = readIds.has(element.dataset.recordId);

        element.classList.toggle("is-read", read);

        const feedRow = element.closest(".record-feed li");

        if (feedRow) {
            feedRow.classList.toggle("is-read", read);
        }

        const button = findToggleButton(element);

        if (button) {
            updateToggleButton(button, read);
        }
    });
}

function injectReadButtons() {
    document
        .querySelectorAll(".record-entry[data-record-id]")
        .forEach(entry => {
            if (entry.querySelector(".read-toggle")) {
                return;
            }

            const heading = entry.querySelector("h3");

            if (!heading || heading.closest(".record-entry-header")) {
                return;
            }

            const button = document.createElement("button");
            button.type = "button";
            button.className = "read-toggle";
            button.textContent = "Mark read";
            button.setAttribute("aria-pressed", "false");

            const header = document.createElement("div");
            header.className = "record-entry-header";

            heading.parentNode.insertBefore(header, heading);
            header.appendChild(heading);
            header.appendChild(button);
        });

    document
        .querySelectorAll(".record-feed-item[data-record-id]")
        .forEach(item => {
            const row = item.closest("li");

            if (!row || row.querySelector(".read-toggle")) {
                return;
            }

            const button = document.createElement("button");
            button.type = "button";
            button.className = "read-toggle read-toggle--compact";
            button.textContent = "○";
            button.title = "Mark as read";
            button.setAttribute("aria-label", "Mark as read");
            button.setAttribute("aria-pressed", "false");

            row.prepend(button);
        });
}

let clickListenerAttached = false;

function attachClickListener() {
    if (clickListenerAttached) {
        return;
    }

    document.addEventListener("click", event => {
        const button = event.target.closest(".read-toggle");

        if (!button) {
            return;
        }

        event.preventDefault();

        const entry =
            button.closest("[data-record-id]") ??
            button.closest(".record-feed li")?.querySelector("[data-record-id]");

        if (!entry?.dataset.recordId) {
            return;
        }

        toggleRead(entry.dataset.recordId);
        applyReadState();
    });

    clickListenerAttached = true;
}

export function initReadTracking() {
    attachClickListener();
    injectReadButtons();
    applyReadState();
}
