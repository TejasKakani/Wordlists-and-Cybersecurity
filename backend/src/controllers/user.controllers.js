const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const User = require("../models/user.models");

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

module.exports = registerUser;