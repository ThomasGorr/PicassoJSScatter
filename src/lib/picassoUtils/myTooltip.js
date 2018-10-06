// Custom Component Doc: https://picassojs.com/docs/components.html#registering-a-custom-component

export const myTooltip = {
    require: ["chart", "renderer"],
    renderer: "dom",
    on: {
        hover(e) {
            try {
                const b = this.chart.element.getBoundingClientRect();
                const point = {
                    x: e.clientX - b.left,
                    y: e.clientY - b.top,
                };
                this.state.nodes = this.chart.shapesAt(point);
                if (this.state.nodes.length > 0) {
                    console.log("Nodes", this.state.nodes);
                }
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

        console.log({shapes});
        const rows = Object.keys(shapes[0].data).filter(prop => prop !== "value" && prop !== "source" && prop !== "tooltipThumbnail").map((dataProp,index) => {
            console.log({dataProp});
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
                    "z-index":1000,
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
        console.log({row});
        // TODO: Fix this: Remove index. Index is used because first row (dimension) has no label property
        const label = index === 0 ? row[Object.keys(row)[0]] : row[Object.keys(row)[0]].label;
        return [
            this.h("div",
                {
                    style: {
                        "margin-right": "4px",
                        "font-weight": 600,
                    },
                },
                Object.keys(row)[0]),
            this.h("div",
                {},
                label),
        ];
    },
    render(h) { // Mandatory, otherwise there is an error
        this.h = h;
        return [];
    },
};