import express from "express";
import {
  allTask,
  deleteTask,
  newTask,
  updateTask,
} from "../controller/task.js";
import { isAuthenticated } from "../middleware/auth.js";

const taskRouter = express.Router();

taskRouter
  .post("/new", isAuthenticated, newTask)
  .get("/all", isAuthenticated, allTask)
  .put("/:id", isAuthenticated, updateTask)
  .delete("/:id", isAuthenticated, deleteTask);

export default taskRouter;
