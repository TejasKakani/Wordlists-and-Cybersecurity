const mongoose = require("mongoose");
const DB_NAME = require("../constants.js").DB_NAME;
const dotenv = require("dotenv");

dotenv.config();

const connectDB = new Promise(async (resolve, reject) => {
    await mongoose.connect(`${process.env.MONGO_DB_URI}/${DB_NAME}`)
    .then((connectionInstance) => {
        resolve(connectionInstance);
    })
    .catch((error) => {
        reject(error);
    });
});

exports.connectDB = connectDB;