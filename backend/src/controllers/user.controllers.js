const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const User = require("../models/user.models");
const jwt = require("jsonwebtoken");

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if(!user){
            throw new ApiError(404, "User not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
    
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
    
        return {accessToken, refreshToken};
    } catch (error) {
        throw new ApiError(500, "Due to Internal Error, Tokens not generated");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;

    if(!username || !email || !password){
        throw new ApiError(400, "Username, email or password are required");
    }
  
    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    });
    
    if(existedUser){
        throw new ApiError(400, "Username or email already existed");
    }
    
    const user = User.create({
        username,
        email,
        password
    });

    const createdUser = await User.findById((await user)._id).select("-password -refreshToken");
    if(!createdUser){
        throw new ApiError(500, "Due to Internal Error, User not created");
    }

    return res.status(201).json(
        new ApiResponse(201, "User created successfully", createdUser)
    );

});

const loginUser = asyncHandler(async (req, res) => {
    const {username, password} = req.body;

    if(!username || !password){
        throw new ApiError(400, "Username or password is required");
    }

    const existedUser = await User.findOne({username});

    if(!existedUser){
        throw new ApiError(404, "User not found");
    }

    if(!(await existedUser.isPasswordCorrect(password))){
        throw new ApiError(401, "Password is incorrect");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken((await existedUser)._id);

    const loggedInUser = await User.findById((await existedUser)._id)
    .select("-password -refreshToken");

    if(!loggedInUser){
        throw new ApiError(500, "Due to Internal Error, User not logged in");
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, "User logged in successfully", 
        {user: loggedInUser, accessToken, refreshToken})
    );
});

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {refreshToken: undefined}
        },
        {new: true}
        );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, "User logged out successfully")
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if(!incomingRefreshToken){
        throw new ApiError(401, "Refresh Token not found");
    }

    try{
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);

        if(!user){
            throw new ApiError(401, "Invalid Refresh Token");
        }

        if(user?.refreshToken !== incomingRefreshToken){
            throw new ApiError(401, "Invalid Refresh Token");
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        }

        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken((await user)._id);

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(200, "Access Token Refreshed", {accessToken, newRefreshToken})
        );

    }
    catch{
        throw new ApiError(401, "Something went wrong while refreshing access Token");
    }

});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}
