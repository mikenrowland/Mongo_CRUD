const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { User, InvalidToken } = require('../models/userModel');
const { check } = require('express-validator');
const { SMTP_SETTINGS } = require('../utils/security');
require('dotenv').config();
const SECRET = process.env.SECRET_KEY;
const validateEmail = check('email');
const validatePassword = check('password');
const regex = /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{6,}$/;


const auth = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token){
        return res.status(401).json({
            message: "No token found! Access denied"
        });
    }

    try {
        const invalidToks = await InvalidToken.findOne({token: token});
        if (invalidToks) {
          return res.status(401).json({
            message: "Access denied! Please login"
          });
        }
        decodeJWT = jwt.verify(token, SECRET);
        const user = await User.findById({_id: decodeJWT.id}).select('-password');
        // const user = decodeJWT.user
        req.user = user;

        next();
    } catch (err) {
        console.log(err),
        res.status(401).json({
          message: "Invalid token! Access denied"
        });
    }
}


const adminAuth = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token){
        return res.status(401).json({
            message: "No token found! Access denied"
        });
    }

    try {
        decodeJWT = jwt.verify(token, SECRET);
        const user = await User.findById({_id: decodeJWT.id}).select('-password');
        if (user.roles != 'admin'){
            return res.status(401).json({
                message: "Admin access required"
            })
        }
        req.user = user;

        next();
    } catch (error) {
        console.log(err),
        res.status(401).json({
            message: "Invalid token! Access denied"
        });
    }
}


validateEmail
  .trim()
  .normalizeEmail()
  .isEmail()
  .withMessage('Email is invalid')
  .custom(async (email) => {
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error('Email already in use');
    }
  });

// Validation chain for checking password
validatePassword.trim().custom(async (password) => {
  if (!password) {
    throw new Error('Field `password` is required');
  } else if (!password.match(regex)) {
    throw new Error(
      'Password must contain min. of 8 characters,\
                and atleast1 Uppercase, 1 lowercase, 1 number,\
                1 special character and no spaces'
    );
  }
});


const sendEmail = async (params) => {
    const transporter = nodemailer.createTransport(SMTP_SETTINGS);
    try {
      let info = await transporter.sendMail({
        from: process.env.MAIL_USERNAME, // Sender's address
        to: params.email, // Receiver's address list
        subject: params.subject, // Subject line
        html: params.template
      });
      console.log(info);
      return info;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  
  module.exports = {
    auth,
    adminAuth,
    sendEmail,
    validateEmail,
    validatePassword,
  };
  