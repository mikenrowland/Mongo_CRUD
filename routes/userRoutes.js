const express = require('express');

const userRouter = express.Router();
const { check } = require('express-validator');
const controller = require('../controllers/userController');
const { validateEmail, validatePassword, auth, adminAuth } = require('../utils/middleware');


userRouter.post(
    "/auth/register", [
    validateEmail, validatePassword
    ], controller.registerUser);

userRouter.post("/auth/login", [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "A valid password is required").exists()
    ], controller.loginUser);

userRouter.put("/auth/verify-email", [
    check("email", "Field `email` is required").exists(),
    check("otp", "Field `otp` is required").exists()
    ], controller.verifyUser);

userRouter.put("/auth/set-roles", adminAuth, [
    check("email", "Please enter a valid email").isEmail(),
    check("role", "Field `role` is required").exists()
    ], controller.setRoles);

userRouter.post("/auth/forgot-password", [
    check("email", "Please enter a valid email").isEmail(),
    ], controller.forgotPassword);

userRouter.put("/auth/reset-password/:token", [
    validatePassword,
    check("confirmPassword", "Field `confirmPassword` is required").exists()
    ], controller.resetPassword);
    
userRouter.get("/auth/logout", controller.logoutUser);


module.exports = userRouter;
