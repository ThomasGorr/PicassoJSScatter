import $ from "jquery";
import "./styles.css";
import {defineHTML} from "./lib/html/divDefinition";
import picasso from "./../node_modules/picasso.js/dist/picasso";
import picassoQ from "./../node_modules/picasso-plugin-q/dist/picasso-q";
import {dompoint} from "./lib/picassoUtils/dompoint";
import {myTooltip} from "./lib/picassoUtils/myTooltip";
import {getUpdateConfig} from "./lib/picassoUtils/chartConfig";
import qlik from "qlik";

export async function main($element, layout, that) {
    try {
        const app = qlik.currApp();
        const properties = await that.backendApi.getProperties();
        picasso.use(picassoQ);
        picasso.component("dompoint", dompoint);
        picasso.component("my-tooltip", myTooltip(properties));
        const data = await createCube(properties, app);
        innerPaint($element, layout, data);
    } catch (e) {
        console.error(e);
    }
}

async function createCube(properties, app) {
    let qHyperCubeDef = JSON.parse(JSON.stringify(properties.qHyperCubeDef));

    if (properties.props.pointRepresentation === "calculatedIcon") {
        qHyperCubeDef.qMeasures.push({
            picassoScatters: {
                technicalId: "pointRepresentation",
            },
            qDef: {
                qLabel: "tooltipThumbnail",
                qDef: properties.props.calculatedItem,
            },
        });
    }
    // Add all tooltip fields as qMeasure to qHyperCubeDef to hold the tooltip information.
    properties.tooltipArray.forEach((tooltipRow) => {
        const value = tooltipRow.props.tooltip.value;
        const key = tooltipRow.props.tooltip.key;
        qHyperCubeDef.qMeasures.push({
            qDef: {
                qLabel: key,
                qDef: value,

            },
        });
    });
    const numberOfMeasures = qHyperCubeDef.qMeasures.length;
    const qWidth = numberOfMeasures + 1; // Plus 1 dimension
    const numberOfDimPoints = Math.floor(10000 / qWidth);
    qHyperCubeDef.qInitialDataFetch = [{qTop: 0, qLeft: 0, qHeight: numberOfDimPoints, qWidth}];
    return await app.createCube(qHyperCubeDef);
}

async function innerPaint($element, layout, data) {
    defineHTML($, $element);
    const pChart = picasso.chart({
        element: $element[0].querySelector("#scatter"),
        data: [],
    });

    const updateConfig = getUpdateConfig(layout, data.layout.qHyperCube);
    pChart.update(updateConfig);

}