const Router = require("express");
const generateWordlist = require("../controllers/generateWordlist.controllers");

const router = Router();

router.route("/").post(generateWordlist);

module.exports = router;

