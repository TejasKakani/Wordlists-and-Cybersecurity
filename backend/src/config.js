const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

//configure .env file
dotenv.config({
    path: "./backend/src/.env"
});

//configuring app
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true , limit: "16kb"}));
app.use(express.static("public"));

//routes configuration
const healthCheckRoute = require("./routes/healthCheck.routes");
app.use("/api/v1/health-check", healthCheckRoute);


module.exports = app;