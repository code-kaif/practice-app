import express from "express";
import {
  getAllUser,
  loginUser,
  logoutUser,
  myDetail,
  registerUser,
} from "../controller/user.js";
import { isAuthenticated } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter
  .get("/all", getAllUser)

  .post("/register", registerUser)

  .post("/login", loginUser)

  .get("/me", isAuthenticated, myDetail)
  
  .get("/logout", logoutUser);
  
export default userRouter;
