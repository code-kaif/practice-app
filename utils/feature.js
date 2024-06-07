import jwt from "jsonwebtoken";

export const setCookie = (user, res, status, messege) => {
  const token = jwt.sign({ _id: user._id }, "kaif");
  res
    .status(status)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Development" ? false : true,
    })
    .json({
      success: true,
      messege: messege,
    });
};
