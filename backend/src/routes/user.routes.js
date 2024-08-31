const Router = require("express");
const registerUser = require("../controllers/user.controllers");

const router = Router();

router.route("/register").post(registerUser);

module.exports = router;