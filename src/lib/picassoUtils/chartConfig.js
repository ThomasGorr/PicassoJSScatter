export function getUpdateConfig(layout, data) {
    const fakeDomPointConfig = getFakeDomPointConfig(layout);
    const customDomPoint = getCustomDomPoint(layout);
    const scales = getScales(layout);
    let chartConfig = {
        data: [{
            type: "q",
            key: "qHyperCube",
            data,
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
                fakeDomPointConfig,
                tooltipDef,
            ],
            interactions: [{
                type: "native",
                events: {
                    mousemove(e) {
                        try {
                            // TODO On Mouseover, set to foreground
                            const tooltip = this.chart.component("my-tooltip");
                            tooltip.emit("hover", e);
                        } catch (e) {
                            console.error(e);
                        }
                    },
                    mouseleave() {
                        const tooltip = this.chart.component("my-tooltip");
                        tooltip.emit("hide");
                    },
                },
            },
            ],
        },
    };
    if(customDomPoint){
        chartConfig.settings.components.push(customDomPoint);
    }
    return chartConfig;
}

function getCustomDomPoint(layout) {
    if (layout.props.pointRepresentation === "calculatedIcon") {
        return { //TODO ACTIVACE/DEACTIVATE CUSTOM DOMPOINT HERE
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
        };
    } else {
        return;
    }
}

function getScales(layout) {
    const qMeasureInfo = layout.qHyperCube.qMeasureInfo;
    return {
        x_axis: {
            data: {field: "qMeasureInfo/0"},
            min: qMeasureInfo[0].qMin - 1000,
            max: qMeasureInfo[0].qMax + 1000,
            expand: 0.1,
            ticks: {
                distance: 100,
            },
        },
        y_axis: {
            data: {field: "qMeasureInfo/1"},
            invert: true,
            expand: 0.1,
            min: qMeasureInfo[1].qMin - 1000,
            max: qMeasureInfo[1].qMax + 1000,
        },
    };
}

function getFakeDomPointConfig(layout) {
    // TODO set this to a rectangle
    // TODO Color by Measure
    let opacity = 0;
    if(layout.props.pointRepresentation == "point"){
        opacity = 1;
    }
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
            opacity,
            size: 1,
            strokeWidth: 0,
        },
    };
}

const tooltipDef = {
    key: "my-tooltip",
    type: "my-tooltip",
    settings: {
        placement: () => ({
            type: "pointer",
            dock: "bottom", //TODO if ->> bottom/top
        }),
    },
};