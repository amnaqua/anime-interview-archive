export default {
    title: "Works",

    endpoint: "works",

    newItem: {
        name: "",
        type: "anime",
        year: null
    },

    fields: [
        {
            name: "name",
            label: "Name",
            type: "text"
        },
        {
            name: "type",
            label: "Type",
            type: "select",
            options: [
                {
                    value: "anime",
                    label: "Anime"
                },
                {
                    value: "manga",
                    label: "Manga"
                },
                {
                    value: "manhwa",
                    label: "Manhwa"
                },
                {
                    value: "ranobe",
                    label: "Ranobe"
                }
            ]
        },
        {
            name: "year",
            label: "Year",
            type: "number"
        }
    ]
}