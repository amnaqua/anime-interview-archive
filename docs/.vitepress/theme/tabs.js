if (typeof window !== "undefined") {
    document.addEventListener("click", e => {
        const tab = e.target.closest(".entity-tab");

        if (!tab)
            return;

        const page = tab.closest(".vp-doc");

        page.querySelectorAll(".entity-tab")
            .forEach(button => button.classList.remove("active"));

        tab.classList.add("active");

        const id = tab.dataset.tab;

        page.querySelectorAll(".entity-section")
            .forEach(section => {
                section.classList.toggle(
                    "active",
                    section.id === id
                );
            });
    });
}