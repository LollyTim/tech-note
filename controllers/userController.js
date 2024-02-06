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

const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  // conferm data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    return res
      .status(409)
      .json({ message: `${username} already takes by another user` });
  }

  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds
  const userObjest = { username, password: hashedPwd, roles };

  const user = await User.create(userObjest);

  if (!user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "invalid user data recieved" });
  }
});

// @desc update a users
// @route patch /users
// @access Private

const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  //confirm data
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All field are required " });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const duplicate = await User.findOne({ username }).lean().exec();
  // Allow update top the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "dulicate username" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    // Hash password
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();
  res.json({ message: `${updatedUser.username} updated` });
});

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
