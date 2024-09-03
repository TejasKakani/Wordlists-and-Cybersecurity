const Router = require("express");
// const registerUser = require("../controllers/user.controllers").registerUser;
// const loginUser = require("../controllers/user.controllers").loginUser;
// const logoutUser = require("../controllers/user.controllers").logoutUser;
const verifyJWT = require("../middlewares/auth.middlewares");
// const refreshAccessToken = require("../controllers/user.controllers").refreshAccessToken;

const { registerUser, loginUser, logoutUser, refreshAccessToken } = require("../controllers/user.controllers");

const router = Router();
 
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-access-token").post(refreshAccessToken);

module.exports = router;