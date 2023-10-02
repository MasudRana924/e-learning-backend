const userModel = require('../models/User');
const sendToken = require('../utilies/jwtToken');
const SendEmail = require('../utilies/sendEmail');
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary');
const ErrorHandler = require("../utilies/ErrorHandler");


exports.createUser = async (req, res, next) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        const findUser = await userModel.findOne({ email: email });
        if (findUser) {
            return next(new ErrorHandler("User already exists", 400));
        }
        const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
        const user = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            activationCode
        };
        
        const activationToken = createActivationToken(user, activationCode);
        const token = activationToken.token
        res.status(201).json({
            success: true,
            message: `please check your email:- ${user.email} to activate your account!`,
            token,
            activationCode
        });
        SendEmail({
            email: user.email,
            subject: "Activate your account",
            message: `Hello ${user.firstname}${user.lastname}, please click on the link to activate your account: ${activationCode}`,

        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }

};

const createActivationToken = (user, activationCode) => {
    const token = jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
    return { token, activationCode }
};
exports.verifyEmail = async (req, res, next) => {
    try {
        const { token, activationCode } = req.body;
        const newUser = jwt.verify(
            token,
            process.env.ACTIVATION_SECRET
        );
        if (!newUser) {
            return next(new ErrorHandler("Expired Token", 400));
        }
        if (newUser.activationCode !== activationCode) {
            return next(new ErrorHandler("Invalid OTP ", 400));
        }
        const { firstname,lastname, email, password, } = newUser;
        let user = await userModel.findOne({ email });
        if (user) {
            return next(new ErrorHandler("User already exists", 400));
        }
        const registerUser = await userModel.create({
            firstname,lastname,
            email,
            password,
        });
        sendToken(registerUser, 201, res);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.json({ message: "Please Enter email & Password" });
    }
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(
            new ErrorHandler("Password does not matched", 400)
        );
    }
    if (isPasswordMatched) {
        sendToken(user, 200, res);
    }
    else {
        res.json({ message: "Please valid Password" });
    }
};
exports.logout = async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
};
// Get User Detail
exports.getUserInfo = async (req, res, next) => {
    const user = await userModel.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    });
};
// update User Info
exports.updateInfo = async (req, res, next) => {
     try{
        const { firstname,lastname,email } = req.body;
     const user = await userModel.findById(req.user._id);
     if(email && user){
        const isEmailExit=await userModel.findOne({ email: email });
        if(isEmailExit){
            return next(new ErrorHandler("Email Already Used", 400));
        }
        user.email=email
     }
     if(firstname && lastname && user){
        user.firstname=firstname;
        user.lastname=lastname;
     }
    // const updatedInfo= await user.save();
    //  res.status(200).json({
    //     success: true,
    //     updatedInfo
    // });
    await user.save();
    sendToken(user, 200, res);
     }catch(error){
        return next(new ErrorHandler(error.message, 400));
     }
};
// update User password
exports.updatePassword = async (req, res, next) => {
    const user = await userModel.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password does not match", 400));
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("New password & confirm password not matched", 400));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
};

exports.updateAvatar = async (req, res, next) => {
    try {

        const user = await userModel.findById(req.user.id);
        const {avatar}=req.body;
         if(avatar && user){
            if(user?.avatar?.public_id){
                await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
                const myCloud=await cloudinary.v2.uploader.upload(avatar,{
                    folder:"avatars",
                    width:150,
                });
                user.avatar={
                    public_id:myCloud.public_id,
                    url:myCloud.secure_url
                }
             }else{
                const myCloud=await cloudinary.v2.uploader.upload(avatar,{
                    folder:"avatars",
                    width:150,
                });
                user.avatar={
                    public_id:myCloud.public_id,
                    url:myCloud.secure_url
                };
             } 
         }
         await user?.save()
             res.status(200).json({
                success: true,
                user,
            });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }

}

exports.getAllUsers = async (req, res) => {
    const users = await userModel.find().sort({createdAt:-1});
    res.status(200).json({ success: true, users });
};
