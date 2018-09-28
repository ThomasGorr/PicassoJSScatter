export const definition = {
    type: "items",
    component: "accordion",
    items: {
        dimensions: {
            uses: "dimensions",
            min: 1,
            max: 2,
        },
        measure: {
            uses: "measures",
            min: 2,
            max: 6,
        },
        sorting: {
            uses: "sorting",
        },
        appearance: {
            uses: "settings",
        },
    },
};