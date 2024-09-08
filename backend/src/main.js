const app = require("./config");
const { connectDB } = require("./db/main.db");

const addon = require("./build/Release/addon");")

const port = process.env.PORT || 3000;

connectDB.then((connectionInstance) => {
    console.log(`MongoDB connected, DB_Host: ${connectionInstance.connection.host}`);
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((err) => {
    console.log(err);
});

module.exports = addon ;