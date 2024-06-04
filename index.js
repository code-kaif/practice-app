import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieparser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/myDB");
  console.log("DB Connected");
}

const mySchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const User = mongoose.model("mydb", mySchema);

const app = express();

app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

app.set("view engine", "ejs");

const isAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const decode = jwt.verify(token, "kaif");
    req.user = await User.findById(decode._id);
    next();
  } else {
    res.redirect("/login");
  }
};

app.get("/", isAuth, (req, res) => {
  console.log(req.user);
  res.render("logout", { name: req.user.name });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) return res.redirect("/register");
  
  const isMatch = await bcrypt.compare(password,user.password)
  if (!isMatch)
    return res.render("login",{email, messege:"Incorrect Password"});
  const token = jwt.sign({ _id: user._id }, "kaif");
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60000),
  });
  res.redirect("/");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) return res.redirect("/login");
  const hashPassword = await bcrypt.hash(password,10)
  user = await User.create({ name: name, email: email, password: hashPassword });
  const token = jwt.sign({ _id: user._id }, "kaif");
  // console.log(token);
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60000),
  });
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  res.cookie("token", "user", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

app.listen(5000, () => {
  console.log("Server is running");
});
