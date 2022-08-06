const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      uniqueCaseInsensitive: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: String,
      enum: ["user", "staff", "manager", "admin"],
      default: "user"
    },
    otp: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
