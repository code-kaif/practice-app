import { User } from "../model/user.js";
import bcrypt from "bcrypt";
import { setCookie } from "../utils/feature.js";
import { errorHandler } from "../middleware/error.js";

export const getAllUser = async (req, res, next) => {
  try {
    const user = await User.find({});
    res.json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return next(new errorHandler("user already exist", 400));

    const hashed = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashed });

    setCookie(user, res, 201, "Register Successfully");
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email }).select("+password");
    if (!user) return next(new errorHandler("invalid email", 404));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new errorHandler("invalid password", 404));

    setCookie(user, res, 200, `Welcome Back, ${user.name}`);
  } catch (err) {
    next(err);
  }
};

export const myDetail = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logoutUser = (req, res) => {
  res
    .cookie("token", "", {
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      messege: "Logout",
    });
};
