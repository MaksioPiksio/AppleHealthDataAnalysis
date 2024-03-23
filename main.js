const fs = require("fs");
const sax = require("sax");

const parser = sax.createStream(true, { trim: true });

let dataStepsObject = [{ day: "", steps: -1 }];
let currentDay = "";

parser.on("opentag", (node) => {
    if (
        node.name === "Record" &&
        node.attributes.type === "HKQuantityTypeIdentifierStepCount"
    ) {
        const creationDate = node.attributes.creationDate.split(" ")[0];
        if (creationDate === currentDay) {
            dataStepsObject[dataStepsObject.length - 1].steps += parseInt(node.attributes.value);
        } else {
            currentDay = creationDate;
            dataStepsObject.push({
                day: currentDay,
                steps: parseInt(node.attributes.value),
            });
        }
    }
});

parser.on("error", (err) => console.error(err));

fs.createReadStream("eksport.xml", { encoding: "utf8" }).pipe(parser);

parser.on("end", () => {
    dataStepsObject.sort((a, b) => a.steps - b.steps);
    console.log(dataStepsObject.reverse()[0]);
});
