

const cluster = require("cluster");

const numCPUs = require("os").cpus().length;

if (cluster.isPrimary) {

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on("exit", (worker) => {
        cluster.fork();
    });
}
else {
    
    const { connectDB } = require("./db/main.db");
    const port = process.env.PORT || 3000;
    const app = require("./config");

    connectDB.then((connectionInstance) => {
        console.log(`[${process.pid}] MongoDB connected, DB_Host: ${connectionInstance.connection.host}`);
        app.listen(port, () => {
            console.log(`[${process.pid}] Server is running on port ${port}`);
        });
    }) 
    .catch((err) => {
        console.log(err);
    });

}