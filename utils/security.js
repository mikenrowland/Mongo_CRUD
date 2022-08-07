const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const SECRET = process.env.SECRET_KEY

OTP_OPTIONS = { 
    upperCaseAlphabets: true,
    lowerCaseAlphabets: true,
    digits: true,
    specialChars: false,
    expireIn: '10m'
};

SMTP_SETTINGS = {
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
    },
};

// OTP generator
const generateOTP = () => {
    const OTP = otpGenerator.generate(6, OTP_OPTIONS);
    return OTP;
  };

// Password hashing
const hashPassword = (password) => {
    let salt = bcrypt.genSaltSync(10);
    hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
}


const decodeJWT = (token) => {
    try {
        tokenData = jwt.verify(token, SECRET);
        return [true, tokenData]
    } catch (err) {
        console.log(err);
        return [false, null]
    };
}


const verifyEmailTemplate = (token) => {
    let template = `
        <div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
        >
            <h2>Registration Successful</h2>
            <h4>Verify Your Email by entering the OTP below</h4>
            <p style="margin-bottom: 30px;">Please enter the sign up OTP to get started</p>
            <h4 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${token}</h4>
            <p style="margin-top:50px;">If you did not signup on Mykie's CRUD API, please kindly ignore this mail.</p>
        </div>
        `
    return template;
}

const passwordResetTemplate = (token) => {
    let template = `
        <div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
        >
            <h2>Password reset link</h2>
            <h4>Click on the link below or copy and paste it into your browser within 5 minutes to reset your password</h4>
            <h4 style="font-size: 18px; letter-spacing: 1px; text-align:center;">http://localhost:3000/api/auth/reset-password/${token}</h4>
            <p style="margin-top:50px;">If you did not request for a password reset, please kindly review your security settings.</p>
        </div>
        `
    return template;
}


module.exports = {
    generateOTP,
    hashPassword,
    decodeJWT,
    SMTP_SETTINGS,
    verifyEmailTemplate,
    passwordResetTemplate,
}