const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
    },
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Pending', 'Active'],
      default: 'Pending'
    },
    otp: {
      type: String,
      // unique: true 
    },
    profileImage: {
      type: String
    },
    gender: {
      type: String,
      enum: ['Female', 'Male', 'other'],
      default: 'Female'
    },
    planet: {
      type: String,
      enum: ['Earth', 'Mars'],
      default: 'Earth'
    },
    country: {
      type: String
    },
    postalCode: {
      type: String
    },
    savedPosts: {
      type: Array
    },
    friendRequests: {
      type: Array
    },
    friends: {
      type: Array
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
