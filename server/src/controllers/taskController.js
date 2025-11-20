import Task from "../models/taskModel.js";

// Create a new task
export const createTask = async (req, res) => {
  try {
    const task = new Task.create(req.body);
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all tasks
export const getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).populate(
      "assignedTo",
      "name email role"
    );

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//update task
export const updateTask = async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task updated successfully", updated });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
//update task status
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Task not found" });
    res
      .status(200)
      .json({ message: "Task status updated successfully", updated });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//add subtask
export const addSubtask = async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { $push: { subtasks: req.body } },
      { new: true }
    );
    res.json({ message: "Subtask added successfully", updated });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//add comments
export const addComment = async (req, res) => {
  try {
    const newComment = {
      user: req.user._id,
      message: req.body.message,
    };

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: newComment } },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete task
export const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
