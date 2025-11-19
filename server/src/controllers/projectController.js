import Project from "../models/projectModel.js";
import User from "../models/userModel.js";

// Create a new project
export const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      client,
      teamMembers,
      startDate,
      endDate,
      status,
    } = req.body;

    const clientExits = await User.findById(client);
    if (!clientExits || clientExits.role !== "client") {
      return res.status(400).json({ message: "Invalid client ID" });
    }

    const project = await Project.create({
      name,
      description,
      client,
      teamMembers,
      startDate,
      endDate,
      status,
    });

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all projects
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("client", "name email")
      .populate("teammembers", "name email role");

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json({ project });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// update project

export const updateProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Project not found" });

    res.status(200).json({ message: "Project updated successfully", updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a project

export const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: "Project not found" });

    res.status(200).json({ message: "Project deleted succesfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
