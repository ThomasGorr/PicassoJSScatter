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
            max: 2,
        },
        sorting: {
            uses: "sorting",
        },
        appearance: {
            uses: "settings",
            items: {
                PointRepresentation: {
                    type: "string",
                    component: "dropdown",
                    label: "Point representation",
                    ref: "props.pointRepresentation",
                    options: [
                        {
                            value: "point",
                            label: "Point",
                        },
                        {
                            value: "defaultIcon",
                            label: "Default icon",
                        },
                        {
                            value: "calculatedIcon",
                            label: "Calculated icon",
                        },
                    ],
                },
                CalculatedItem: {
                    type: "string",
                    label: "Calculated icon",
                    ref: "props.calculatedItem",
                    show: (action) => {
                        return action.props.pointRepresentation === "calculatedIcon";
                    },
                },
            },
        },
        tooltip: {
            type: "items",
            label: "Tooltip definition",
            items: {
                tooltipList: {
                    type: "array",
                    ref: "tooltipArray",
                    label: "Tooltip definition",
                    itemTitleRef: "props.tooltip.key",
                    allowAdd: true,
                    allowRemove: true,
                    addTranslation: "Add Tooltip line",
                    items: {
                        tooltipRepresentationType: {
                            type: "string",
                            component: "dropdown",
                            label: "Representation",
                            ref: "props.tooltipRepresentationType",
                            defaultValue: "text",
                            options: [
                                {
                                    value: "text",
                                    label: "Text",
                                },
                                {
                                    value: "img",
                                    label: "Image",
                                },
                            ],
                        },
                        key: {
                            type: "string",
                            ref: "props.tooltip.key",
                            label: "Key",
                        },
                        value: {
                            type: "string",
                            ref: "props.tooltip.value",
                            label: "Value",
                            expression: "optional",
                        },
                    },
                },
            },
        },
    },
};