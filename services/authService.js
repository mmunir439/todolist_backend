const User = require("../model/user");
const Task = require("../model/task");
const AppError = require("../utils/AppError");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");

const sanitizeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  cnic: user.cnic,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

exports.register = async ({ username, email, password, cnic }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new AppError("Email already registered", 409);

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    cnic: cnic || "",
  });

  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    username: user.username,
  });

  return { user: sanitizeUser(user), token };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("Invalid email or password", 401);

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new AppError("Invalid email or password", 401);

  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    username: user.username,
  });

  return { user: sanitizeUser(user), token };
};

exports.getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new AppError("User not found", 404);
  return sanitizeUser(user);
};

exports.updateProfile = async (userId, updates) => {
  if (updates.password) {
    updates.password = await hashPassword(updates.password);
  }

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) throw new AppError("User not found", 404);
  return sanitizeUser(user);
};

exports.deleteAccount = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new AppError("User not found", 404);
  await Task.deleteMany({ userId });
};
