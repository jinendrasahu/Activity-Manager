const dotenv = require("dotenv");
dotenv.config();
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.SECRET_KEY);
const { User } = require("../models/UserModel");

module.exports.register = async (req, res, next) => {
    if (!req.body.email || !req.body.email.toString().trim() || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email.toString().trim())) {
        return res.status(400).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: false,
            message: "Please enter valid email address."
        });
    }
    if (req.body.resend === undefined) {
        if (!req.body.password || !req.body.password.toString().trim()) {
            return res.status(400).json({
                timestamp: Math.floor(Date.now() / 1000),
                success: false,
                message: "Password is required."
            });
        }
        if (!req.body.confirmpassword || !req.body.confirmpassword.toString().trim()) {
            return res.status(400).json({
                timestamp: Math.floor(Date.now() / 1000),
                success: false,
                message: "Confirm password is required."
            });
        }
        if (req.body.password.toString().trim() !== req.body.confirmpassword.toString().trim()) {
            return res.status(400).json({
                timestamp: Math.floor(Date.now() / 1000),
                success: false,
                message: "Password and confirm password should be same."
            });
        }
        if (Object.keys(req.body).length !== 3) {
            return res.status(400).json({
                timestamp: Math.floor(Date.now() / 1000),
                success: false,
                message: "Extra parameter passed."
            });
        }
    } else {
        if (Object.keys(req.body).length !== 2) {
            return res.status(400).json({
                timestamp: Math.floor(Date.now() / 1000),
                success: false,
                message: "Extra parameter passed."
            });
        }
    }
    let num = Math.random();
    num = num < 0.1 ? num + 0.1 : num;
    let generateOTP = Math.floor(num * Math.pow(10, 6));
    let token = cryptr.encrypt(generateOTP);
    let condition = {
        email: req.body.email.toString().trim()
    }
    let isUserDataExist = await User.findOne(condition);
    if (isUserDataExist && isUserDataExist._id && isUserDataExist.isVarified) {
        return res.status(400).json({
            timestamp: Math.floor(Date.now() / 1000),
            success: false,
            message: "User already exist with this email please login to your existing account."
        });
    } else if (isUserDataExist && isUserDataExist._id) {
        let updateData = { $set: { token, updated: Date.now() } }
        let user = await User.findOneAndUpdate(condition, updateData, { new: true, upsert: false });
        if (user && user._id) {
            req.code = generateOTP;
            next();
        } else {
            return res.status(400).json({
                timestamp: Math.floor(Date.now() / 1000),
                success: false,
                message: "Failed to save user data.Try again"
            });
        }
    } else {
        if (req.body.resend !== undefined) {
            return res.status(400).json({
                timestamp: Math.floor(Date.now() / 1000),
                success: false,
                message: "Invalid email id."
            });
        }
        let data = {
            email: req.body.email.toString().trim(),
            password: cryptr.encrypt(req.body.password.toString().trim()),
            token: token
        }
        let user = await User.create(data);
        if (user) {
            req.code = generateOTP;
            next();
        } else {
            return res.status(400).json({
                timestamp: Math.floor(Date.now() / 1000),
                success: false,
                message: "Failed to save user data.Try again"
            });
        }
    }
}