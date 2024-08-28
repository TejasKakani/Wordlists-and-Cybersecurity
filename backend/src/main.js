const express = require("express");

const port = 3000;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Wordlists and Cybersecurity");
});

app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
});
