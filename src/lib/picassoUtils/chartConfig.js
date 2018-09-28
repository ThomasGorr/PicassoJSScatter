export function getUpdateConfig(layout) {
    const fakeDomPointConfig = getFakeDomPointConfig();
    return {
        data: [{
            type: "q",
            key: "qHyperCube",
            data: layout.qHyperCube,
        }],
        settings: {
            scales,
            components: [
                {
                    key: "my_x_axis",
                    type: "axis",
                    dock: "bottom",
                    scale: "x_axis",
                },
                {
                    key: "my_y_axis",
                    type: "axis",
                    dock: "left",
                    scale: "y_axis",
                },
                { //TODO ACTIVACE/DEACTIVATE CUSTOM DOMPOINT HERE
                    key: "dom_point",
                    type: "dompoint",
                    data: {
                        extract: {
                            field: "qDimensionInfo/0",
                            props: {
                                x: {field: "qMeasureInfo/0"},
                                y: {field: "qMeasureInfo/1"},
                                thumbnail: {field: "qMeasureInfo/2"},
                            },
                        },
                    },
                    settings: {
                        x: {scale: "x_axis"},
                        y: {scale: "y_axis"},
                        "background-size": "cover",
                    },
                },
                fakeDomPointConfig,
                tooltipDef,
            ],
            interactions: [{
                type: "native",
                events: {
                    mousemove(e) {
                        console.log("MOUSEMOVE", e);
                        try {
                            const tooltip = this.chart.component("tooltip");
                            tooltip.emit("show", e);
                        } catch (e) {
                            console.error(e);
                        }
                    },
                    mouseleave() {
                        const tooltip = this.chart.component("tooltip");
                        tooltip.emit("hide");
                    },
                },
            },
            ],
        },
    };
}


const scales = {
    x_axis: {
        data: {field: "qMeasureInfo/0"},
        min: 0,//{field: "qGrandTotalRow/0/qMin"},
        max: {field: "qGrandTotalRow/0/qMax"},
        expand: 0.1,
        ticks: {
            distance: 100,
        },
    },
    y_axis: {
        data: {field: "qMeasureInfo/1"},
        invert: true,
        expand: 0.1,
        min: 0,
        max: {field: "qGrandTotalRow/1/qMax"},
    },
};

function getFakeDomPointConfig() {
    return {
        key: "point",
        type: "point",
        data: {
            extract: {
                field: "qDimensionInfo/0",
                props: {
                    x: {field: "qMeasureInfo/0"},
                    y: {field: "qMeasureInfo/1"},
                },
            },
        },
        settings: {
            x: {scale: "x_axis"},
            y: {scale: "y_axis"},
            opacity: 0.8,
            size: 1,
            strokeWidth: 2,
            stroke: "#fff",
        },
    };
}


const tooltipDef = {
    key: "tooltip",
    type: "tooltip",
    settings: {
        placement: "pointer",
    },
};