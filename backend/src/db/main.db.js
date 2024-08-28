const mongoose = require('mongoose');
const DB_NAME = require('../constants');
const dotenv = require("dotenv");

dotenv.config({
    path: "./backend/src/.env"
});

const connectDB = new Promise((resolve, reject) =>{
    const connectionInstance = mongoose.connect(`${process.env.MONGO_DB_URI}/${DB_NAME}`);
    if(connectionInstance){
        resolve(connectionInstance);
    }else{
        reject("Error connecting to MongoDB");
    }
});

exports.connectDB = connectDB;