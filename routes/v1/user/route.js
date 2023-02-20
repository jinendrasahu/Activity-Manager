const express = require("express");
const { register } = require("../../../middlewares/register");
const { varifyToken } = require("../../../middlewares/varifyToken");
const { Login } = require("../../../modules/auth/Login");
const { logout } = require("../../../modules/auth/Logout");
const { sendVarificationMail } = require("../../../modules/otp/SendVarificationMail");
const { varifyOtp } = require("../../../modules/otp/VarifyOtp");

const apiRoutes = express.Router();
apiRoutes.post("/register", register, sendVarificationMail);
apiRoutes.post("/resendotp", register, sendVarificationMail);
apiRoutes.post("/varify", varifyOtp);
apiRoutes.post("/login", Login);
apiRoutes.post("/logout", varifyToken, logout);

module.exports = apiRoutes