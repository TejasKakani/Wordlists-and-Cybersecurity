const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const errorHandler = require("./middlewares/error.middlewares");

//configure .env file
dotenv.config();

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
const generateWordlistRoute = require("./routes/generateWordlist.route");

app.use("/api/v1/health-check", healthCheckRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/generate-wordlist", generateWordlistRoute);
//app.use(errorHandler);

module.exports = app;