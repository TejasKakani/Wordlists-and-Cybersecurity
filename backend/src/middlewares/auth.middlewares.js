const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const User = require("../models/user.models");
const jwt = require("jsonwebtoken");

const verifyJWT = asyncHandler(async (req, _, next) => {
    const accessToken = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if(!accessToken){
        throw new ApiError(401, "Access Token is required");
    }

    try{
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if(!user){
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    }
    catch(err){
        throw new ApiError(401, err?.message || "Invalid Access Token");
    }
});

module.exports = verifyJWT;