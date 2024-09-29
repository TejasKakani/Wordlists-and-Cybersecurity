const { parentPort, workerData } = require("worker_threads");
const generate = require("../../build/Release/generate");
const ApiError = require("./ApiError");
const fs = require("fs");

const { clue, length } = workerData;

generate.getStringArray(clue, Number(length), (linesWritten, error) => {

    if (error) {
        fs.unlinkSync("wordlist.txt");
        parentPort.postMessage(error);
        return;
    }

    fs.readFile("wordlist.txt", "utf-8", (err, data) => {
    
        if (err) {
            fs.unlinkSync("wordlist.txt");
            parentPort.postMessage(err);
            return;
        }

        const stream = fs.createReadStream("wordlist.txt", "utf-8");
        stream.on("error", (error) => {
            fs.unlinkSync("wordlist.txt");
            parentPort.postMessage(error);
        });
        stream.on("data", (chunk) => {
            parentPort.postMessage(chunk.toString());
        });
        stream.on("end", () => {
            fs.unlinkSync("wordlist.txt");
            parentPort.postMessage("exit");
        });
    });
});
