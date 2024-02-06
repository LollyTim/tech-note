const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route Get /users
// @access Private

const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
});

// @desc Create nwe users
// @route post /users
// @access Private

const createNewUser = asyncHandler(async (req, res) => {});

// @desc update a users
// @route patch /users
// @access Private

const updateUser = asyncHandler(async (req, res) => {});

// @desc delete a users
// @route delete /users
// @access Private

const deleteUser = asyncHandler(async (req, res) => {});

module.exports = {
  getAllUser,
  createNewUser,
  updateUser,
  deleteUser,
};
