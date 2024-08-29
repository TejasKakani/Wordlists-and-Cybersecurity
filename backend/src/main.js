const app = require("./config");
const { connectDB } = require("./db/main.db");

const port = process.env.PORT || 3000;

connectDB.then((connectionInstance) => {
    console.log(`\nMongoDB connected, DB_Host: ${connectionInstance.connection.host}`);
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((err) => {
    console.log(err);
});