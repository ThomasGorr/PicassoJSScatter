// Custom Component Doc: https://picassojs.com/docs/components.html#registering-a-custom-component

export function myTooltip(properties) {
    const tooltipArray = properties.tooltipArray;

    return {
        require: ["chart", "renderer"],
        renderer: "dom",
        on: {
            hover(e) {
                try {
                    const b = this.chart.element.getBoundingClientRect();
                    // TODO Check if x or y is null
                    const point = {
                        x: e.clientX - b.left,
                        y: e.clientY - b.top,
                    };
                    this.state.nodes = this.chart.shapesAt(point);
                    this.state.nodes.map((node) => {
                        Object.keys(node.data).forEach((key) => {
                            tooltipArray.forEach((tooltip) => {
                                if (tooltip.props.tooltip.key === key) {
                                    node.data[key].representationType = tooltip.props.tooltip.representationType;
                                    if (node.data[key].representationType === "img") {
                                        node.data[key].icon = tooltip.props.tooltip.icon;
                                    }
                                }
                            });
                        });
                    });
                    this.renderer.render(this.buildNodes());
                } catch (e) {
                    console.error(e);
                }
            },
        },
        buildNodes() {
            // Filter out any node that doesn't have any data bound to it or is a container node.
            const shapes = this.state.nodes.filter(n => n.data);
            if (!shapes.length) {
                return [];
            }

            // Find an appropriate place to position the tooltip, lower right corner is good enough for now.
            const targetNode = shapes[shapes.length - 1];
            const nodeComp = this.chart.component(targetNode.key);
            const nodeDelta = nodeComp ? nodeComp.rect : {x: 0, y: 0};
            const left = targetNode.bounds.x + targetNode.bounds.width + nodeDelta.x - this.rect.x;
            const top = targetNode.bounds.y + targetNode.bounds.height + nodeDelta.y - this.rect.y;

            const rows = Object.keys(shapes[0].data).filter(prop => prop !== "value" && prop !== "source" && prop !== "tooltipThumbnail").map((dataProp, index) => {
                const row = {};
                row[dataProp] = shapes[0].data[dataProp];
                return this.h("div",
                    {
                        style: {
                            display: "flex",
                        },
                    },
                    this.buildRow(row, index)
                );
            });

            return [
                this.h("div", {
                    style: {
                        position: "relative",
                        left: `${left}px`,
                        top: `${top}px`,
                        background: "white",//this.settings.background,
                        color: "#888",
                        display: "inline-block",
                        "box-shadow": "0px 0px 5px 0px rgba(123, 123, 123, 0.5)",
                        "border-radius": "5px",
                        padding: "8px",
                        "font-size": this.settings.fontSize,
                        "font-family": "Arial",
                        "z-index": 1000,
                        "max-width": "300px",
                    },
                },
                rows),
            ];
        },
        created() {
            this.state = {nodes: []};
        },
        beforeRender(opts) {
            this.rect = opts.size;
        },
        buildRow(row, index) {
            let representationType = "text"; //default
            const currTooltipRow = row[Object.keys(row)[0]];

            if (currTooltipRow.hasOwnProperty("representationType")
                && (currTooltipRow.representationType !== "text" && currTooltipRow.representationType !== undefined)) {
                representationType = currTooltipRow.representationType;
            }
            // TODO: Fix this: Remove index. Index is used because first row (dimension) has no label property
            const label = index === 0 ? currTooltipRow : currTooltipRow.label;
            let tooltipRow = [];
            if (representationType === "text") {
                tooltipRow.push(this.h("div",
                    {
                        style: {
                            "margin-right": "4px",
                            "font-weight": 600,
                        },
                    },
                    Object.keys(row)[0]));
                tooltipRow.push(this.h("div",
                    {},
                    label));
            } else if (representationType === "img") {
                const width = currTooltipRow.icon.width;
                const height = currTooltipRow.icon.height;

                tooltipRow.push(this.h("div", [
                    this.h("img", {attrs: {src: label, height, width}}, []),
                ]));
            }
            return tooltipRow;
        },
        render(h) { // Mandatory, otherwise there is an error
            this.h = h;
            return [];
        },
    };
}
