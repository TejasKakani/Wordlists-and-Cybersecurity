const mongoose = require("mongoose");
const DB_NAME = require("../constants.js").DB_NAME;

const connectDB = new Promise((resolve, reject) =>{
    const connectionInstance = mongoose.connect(`${process.env.MONGO_DB_URI}/${DB_NAME}`);
    if(connectionInstance){
        resolve(connectionInstance);
    }else{
        reject("Error connecting to MongoDB");
    }
});

exports.connectDB = connectDB;