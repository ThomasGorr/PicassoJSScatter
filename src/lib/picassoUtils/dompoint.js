const DEFAULT_SETTINGS = ({
    width: 60,
    height: 60,
});

export const dompoint = {
    require: ["resolver"],
    renderer: "dom",
    beforeRender(options) {
        this.size = options.size;
    },
    generatePoints(data) {
        return data.items.map((row) => {
            const width = DEFAULT_SETTINGS.width;
            const height = DEFAULT_SETTINGS.height;
            const thumbLabel = row.data.thumbnail.label;
            const thumbDefault = "https://developer.qlik.com/assets/garden-icon.png";
            const imageSrc = thumbLabel === "-" ? thumbDefault : thumbLabel;
            const style = {
                position: "absolute",
                left: `${(this.size.width * row.x) - (data.settings.width / 2)}px`,
                top: `${(this.size.height * row.y) - (data.settings.height / 2)}px`,
                width: `${width}px`,
                height: `${height}px`,
                "background-image": "url(" + imageSrc + ")",
            };

                // filter out any reserved keys but allow for other style keys
                // mutates style
            const ILLEGAL_KEY_NAMES = ["x", "y", "width", "height", "left", "top", "position"];
            Object.keys(data.settings)
                .filter(key => ILLEGAL_KEY_NAMES.indexOf(key) === -1)
                .forEach(key => style[key] = data.settings[key]);

            return this.h("div", {style});
        }
        );
    },
    render(h, {data}) {
        this.h = h; //snabbdom reference

        const resolved = this.resolver.resolve({
            data,
            settings: this.settings.settings,
            defaults: Object.assign({}, DEFAULT_SETTINGS),
            scaled: {
                x: this.size.width,
                y: this.size.height,
            },
        });

        return this.generatePoints(resolved);
    },
};