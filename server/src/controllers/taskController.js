import Task from "../models/taskModel.js";
import Project from "../models/projectModel.js";

const emit = (req, event, payload) => {
  try {
    const io = req.app.get("io");
    if (io) io.emit(event, payload);
  } catch (err) {
    console.error("Socket emit error:", err.message);
  }
};

export const createTask = async (req, res) => {
  try {
    // Check if user is a manager trying to create a task
    if (req.user.role === "manager") {
      // Verify the manager is assigned to this project
      const project = await Project.findById(req.body.project);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const isTeamMember = project.teamMembers.some(
        member => member.toString() === req.user._id.toString()
      );
      
      if (!isTeamMember) {
        return res.status(403).json({ 
          message: "You can only create tasks for projects you are assigned to" 
        });
      }
    }

    const task = await Task.create(req.body);
    emit(req, "refreshKanban", { projectId: task.project, taskId: task._id, action: "created" });
    emit(req, "refreshTasks", { projectId: task.project });
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: error.message, details: error });
  }
};

export const getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignedTo", "name email role")
      .populate("comments.user", "name email");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Task not found" });

    emit(req, "refreshTasks", { projectId: updated.project, taskId: updated._id, action: "updated" });
    emit(req, "refreshKanban", { projectId: updated.project, taskId: updated._id, action: "updated" });

    res.json({ message: "Task updated successfully", updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) return res.status(404).json({ message: "Task not found" });

    const isAdmin = req.user.role === "admin";
    const isManager = req.user.role === "manager";
    const isAssignedEmployee = req.user.role === "employee" && 
                                task.assignedTo?.toString() === req.user._id.toString();

    if (isAssignedEmployee && !task.allowEmployeeStatusChange) {
      return res.status(403).json({ 
        message: "You don't have permission to change this task's status. Contact your admin or manager." 
      });
    }

    if (!isAdmin && !isManager && !isAssignedEmployee) {
      return res.status(403).json({ 
        message: "You don't have permission to change this task's status" 
      });
    }

    const updated = await Task.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    ).populate("assignedTo", "name email role");

    emit(req, "refreshKanban", { projectId: updated.project, taskId: updated._id, action: "statusChanged", status });
    emit(req, "refreshTasks", { projectId: updated.project });

    res.json({ message: "Task status updated", updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addSubtask = async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, { $push: { subtasks: req.body } }, { new: true });
    emit(req, "refreshTasks", { projectId: updated.project, taskId: updated._id, action: "subtaskAdded" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleSubtask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, "subtasks._id": req.params.subtaskId },
      { $bit: { "subtasks.$.isCompleted": { xor: 1 } } },
      { new: true }
    );

    emit(req, "refreshTasks", { projectId: task.project, taskId: task._id, action: "subtaskToggled" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const newComment = { user: req.user._id, message: req.body.message };
    const updated = await Task.findByIdAndUpdate(req.params.id, { $push: { comments: newComment } }, { new: true })
      .populate("comments.user", "name email");
    emit(req, "refreshTasks", { projectId: updated.project, taskId: updated._id, action: "commentAdded" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Task not found" });

    emit(req, "refreshTasks", { projectId: deleted.project, taskId: deleted._id, action: "deleted" });
    emit(req, "refreshKanban", { projectId: deleted.project, taskId: deleted._id, action: "deleted" });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyTasks = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate("project", "name status")
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    console.error("Error in getMyTasks:", error);
    res.status(500).json({ message: error.message });
  }
};