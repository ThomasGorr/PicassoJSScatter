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
        picasso.use(picassoQ);
        picasso.component("dompoint", dompoint);
        picasso.component("my-tooltip", myTooltip);
    } catch (e) {
        console.error(e);
    }
    const app = qlik.currApp();
    const properties = await that.backendApi.getProperties();
    const data = await createCube(properties, app);
    console.log("Properties", properties);
    innerPaint($element, layout, data);
}

async function createCube(properties, app) {
    let qHyperCubeDef = properties.qHyperCubeDef;
    if (properties.props.pointRepresentation === "calculatedIcon") {
        qHyperCubeDef.qMeasures.push({
            picassoScatters: {
                technicalId: "pointRepresentation",
            },
            qDef: {
                qDef: properties.props.calculatedItem,
            },
        });
    }
    properties.tooltipArray.forEach((tooltipRow) => {
        const value = tooltipRow.props.tooltip.value;
        qHyperCubeDef.qMeasures.push({
            qDef: {
                qDef: value,

            },
        });
    });
    console.log("HyperCubeDef", qHyperCubeDef);
    console.log("#2 qMeasures:", qHyperCubeDef.qMeasures.length);
    qHyperCubeDef.qInitialDataFetch = [{qTop: 0, qLeft: 0, qHeight: 500, qWidth: 20}];
    return await app.createCube(qHyperCubeDef);
}

async function innerPaint($element, layout, data) {
    defineHTML($, $element);
    const pChart = picasso.chart({
        element: $element[0].querySelector("#scatter"),
        data: [],
    });

    const updateConfig = getUpdateConfig(layout, data.layout.qHyperCube, "");
    pChart.update(updateConfig);

}