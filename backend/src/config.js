const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/error.middlewares");

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
app.use(cookieParser());

//routes configuration
const healthCheckRoute = require("./routes/healthCheck.routes");
const userRoute = require("./routes/user.routes");

app.use("/api/v1/health-check", healthCheckRoute);
app.use("/api/v1/users", userRoute);
// app.use(errorHandler);

module.exports = app;