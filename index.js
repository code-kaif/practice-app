import express from "express";
import { dbConnection } from "./data/database.js";
import userRouter from "./router/user.js";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import taskRouter from "./router/task.js";
import { errorMiddleware } from "./middleware/error.js";
import cors from "cors";

dbConnection();

const app = express();

// using middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
-(
  // using routes
  app.use("/api/v1/user", userRouter)
);
app.use("/api/v1/task", taskRouter);

app.get("/", (req, res) => {
  res.send("Ohh yeah daddy!!");
});

app.use(errorMiddleware);

app.listen(process.env.SERVER_PORT, () =>
  console.log(
    `Server is running on Port ${process.env.SERVER_PORT} in ${process.env.NODE_ENV} Mode`
  )
);
