const { User, InvalidToken } = require('../models/userModel');
const { 
    decodeJWT,
    generateOTP,
    hashPassword, 
    verifyEmailTemplate,
    passwordResetTemplate,
    } = require('../utils/security');
const { sendEmail } = require('../utils/middleware');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET_KEY;


const registerUser = async (req, res) => {
    // Validates input data at request time
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() }); // Custom error response if data is invalid
    }

    const data = req.body;
    data.password = hashPassword(data.password);
    data.otp = generateOTP();
    const user = new User(data);
    try {
        user.save().then((result) => {
        const params = { 
            email: result.email,
            template: verifyEmailTemplate(result.otp),
            subject: `Welcome to Mykie's CRUD API`
        };
        
        if (sendEmail(params)) {
            msg = "Success! User registered";
        } else {
            msg = "User registered but OTP not sent";
        }
        return res.status(201).json({
            message: msg,
            data: {
            user_id: result._id,
            email: result.email,
            verified: result.emailVerified,
            created_at: result.createdAt,
            },
        });
        });
    } catch (err) {
        console.log(err);
        console.error(err);
        res.status(500).send({
            message: 'Server Error! Registration unsuccessful'
        });
    }
};


const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    const {email, password} = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user){
                return res.status(400).json({
                    message: 'User not found'
                });
            }
        if (!user.emailVerified){
            return res.status(401).json({
                message: 'User is not verified'
            });
        }
        const validPwd = await bcrypt.compare(password, user.password);
        if (!validPwd) {
                return res.status(401).json({
                    message: 'Incorrect Auth credentials'
                });
            }
        
        //Generate auth token
        const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d"});
        return res.status(200).header('Authorization', token)
            .json({
                message: 'Login successful'
            }); 
    } catch (err) {
        console.log(err);
        console.error(err);
        res.status(500).send({
            message: 'Server Error! Login unsuccessful'
        });
    }  
};


const logoutUser = async (req, res) => {
    const token = req.header('Authorization');
    try {
        await InvalidToken.create({token: token});
        return res.status(200).json({
            message: 'User successfully logged out'
        })
    } catch (err) {
        console.log(err);
        console.error(err);
        res.status(500).send({
            message: 'Server Error!'
        });
    }
}


const verifyUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    const {email, otp} = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }
        if (user.otp != otp) {
            return res.status(401).json({
                message: 'OTP invalid. Access Denied'
            });
        }
        user.emailVerified = true;
        user.save()
        return res.status(200).json({
            message: 'Email verification successful',
            user_verified: user.emailVerified
        })
    } catch (err) {
        console.log(err);
        console.error(err);
        res.status(500).send({
            message: 'Server Error! Verification failed'
        });
    }
}


const forgotPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    const email = req.body.email;

    try {
        const user = await User.findOne({ email });
        if (!user){
            return res.status(400).json({
                message: 'User not found'
            });
        }
        const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "10m"});
        const params = { 
            email: email,
            template: passwordResetTemplate(token),
            subject: 'Password Recovery'
        };
        
        if (sendEmail(params)) {
            return res.status(200).json({
                message: `Password reset link sent to ${email}`,
            });
        }
    } catch (err) {
        console.log(err);
        console.error(err);
        res.status(500).send({
            message:'Server Error! Link not sent'
        });
    }
}


const resetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }

    const token = req.params.token;
    const { password, confirmPassword } = req.body;
    if (password != confirmPassword){
        return res.status(400).json({
            message: `Passwords entered doesn't match`
        });
    }

    tokenData = decodeJWT(token);
    if (!tokenData[0]){
        return res.status(401).json({
        message: 'Token invalid or expired'
        });
    }
    try {
        const user = await User.findById({ _id: tokenData[1].id });
        if (!user){
            return res.status(400).json({
                message: 'User not found'
            });
        }
        user.password = hashPassword(password);
        user.save().then((result) => {
            if (result) {
                return res.status(200).json({
                    message: 'Password reset successful'
                });
            }
        })
    } catch (err) {
        console.log(err);
        console.error(err);
        res.status(500).send({
            message: 'Server Error! Password reset failed'
        });
    }
}


const setRoles = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }

    const { email, role } = req.body;
    let enumValues = [ 'user', 'staff', 'manager', 'admin' ];
    if (!enumValues.includes(role)) {
        return res.status(400).json({
            message: `${role} is not a valid enum value for path 'roles'`,
            enumValues
        });
    }
    try {
        const user = await User.findOne({ email }).select('-password');
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }

        user.roles = role;
        user.save();
        return res.status(200).json({
            message: 'Role set successfully',
            user: {
                user_id: user._id,
                email: user.email,
                role: user.roles
            }
        })
    } catch (err) {
        console.log(err);
        console.error(err);
        res.status(500).send({
            message:'Server Error! Role not set'
        });
    }
}

module.exports = { 
    resetPassword,
    forgotPassword,
    registerUser,
    loginUser,
    logoutUser,
    verifyUser,
    setRoles
};
