function activateSection(page, sectionId) {
    page.querySelectorAll(".entity-tab").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.tab === sectionId
        );
    });

    page.querySelectorAll(".entity-section").forEach(section => {
        section.classList.toggle(
            "active",
            section.id === sectionId
        );
    });
}

function getEntryElements(heading) {
    const elements = [heading];
    let el = heading.nextElementSibling;

    while (el && el.tagName !== "H3") {
        elements.push(el);

        if (el.tagName === "HR")
            break;

        el = el.nextElementSibling;
    }

    return elements;
}

let highlightTimer = null;

function clearHighlight() {
    if (highlightTimer) {
        clearTimeout(highlightTimer);
        highlightTimer = null;
    }

    document.querySelectorAll(".entry-flash").forEach(el => {
        el.classList.remove("entry-flash");
    });
}

function highlightEntry(heading) {
    clearHighlight();

    const target = document.getElementById(heading.id) ?? heading;
    const elements = getEntryElements(target);

    if (!elements.length)
        return;

    for (const el of elements) {
        el.classList.add("entry-flash");
    }

    highlightTimer = setTimeout(() => {
        clearHighlight();
    }, 2200);
}

function scrollToEntry(target) {
    target.scrollIntoView({
        block: "center",
        inline: "nearest",
        behavior: "auto"
    });
}

function activateTabForHash() {
    const hash = decodeURIComponent(location.hash.slice(1));

    if (!hash)
        return;

    const page = document.querySelector(".vp-doc");

    if (!page)
        return;

    const target = document.getElementById(hash);

    if (!target || !page.contains(target))
        return;

    const section = target.closest(".entity-section");

    if (section) {
        activateSection(page, section.id);
    }

    const focus = () => {
        const current = document.getElementById(hash);

        if (!current)
            return;

        scrollToEntry(current);
        highlightEntry(current);
    };

    requestAnimationFrame(() => {
        focus();
        // VitePress may adjust scroll after route change; re-apply shortly after.
        setTimeout(focus, 60);
    });
}

if (typeof window !== "undefined") {
    document.addEventListener("click", e => {
        const tab = e.target.closest(".entity-tab");

        if (!tab)
            return;

        const page = tab.closest(".vp-doc");

        if (!page)
            return;

        activateSection(page, tab.dataset.tab);
    });

    window.addEventListener("hashchange", activateTabForHash);
    window.addEventListener("DOMContentLoaded", activateTabForHash);
}

export { activateTabForHash };
