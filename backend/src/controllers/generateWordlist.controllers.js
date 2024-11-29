const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const fs = require("fs");
const { Worker } = require("worker_threads");

const generateWordlist = asyncHandler((req, res) => {
    
    const worker = new Worker("./src/utils/worker.js", {
        workerData: {
            clue: req.body.clue,
            length: req.body.length,
            startsWithClue: req.body.startsWithClue || [],
            containsClue: req.body.containsClue || [],
            endsWithClue: req.body.endsWithClue || []
        }
    });

    worker.on("message", (wordlistDataChunk) => {
     
        if (wordlistDataChunk === "exit") {
            res.end();
            return;
        }
        res.write(wordlistDataChunk);
    });

    worker.on("error", (error) => {
        throw new ApiError(500, error.message);
    });

 
});

module.exports = generateWordlist;
