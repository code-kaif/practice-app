import { errorHandler } from "../middleware/error.js";
import { Task } from "../model/task.js";

export const newTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    await Task.create({ title, description, user: req.user });

    res.status(201).json({
      success: true,
      messege: "Task added",
    });
  } catch (err) {
    next(err);
  }
};

export const allTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const task = await Task.find({ user: userId });
    res.status(200).json({
      success: true,
      task,
    });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return next(new errorHandler("invalid id can't update", 404));

    task.isCompleted = !task.isCompleted;
    await task.save();

    res.status(200).json({
      success: true,
      messege: "Task Updated",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return next(new errorHandler("invalid id can't delete", 404));

    await task.deleteOne();

    res.status(200).json({
      success: true,
      messege: "Task Deleted",
    });
  } catch (err) {
    next(err);
  }
};
