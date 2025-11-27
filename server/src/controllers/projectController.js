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

    // Validate client if provided
    if (client) {
      const clientExists = await User.findById(client);
      if (!clientExists || clientExists.role !== "client") {
        return res.status(400).json({ message: "Invalid client ID" });
      }
    }

    const project = await Project.create({
      name,
      description,
      client: client || null,
      teamMembers: teamMembers || [],
      startDate: startDate || null,
      endDate: endDate || null,
      status: status || "Not Started",
    });

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("client", "name email")
      .populate("teamMembers", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("client", "name email")
      .populate("teamMembers", "name email role");

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json({ project });
  } catch (error) {
    console.error("Error fetching project by ID:", error);
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

// Get projects for the current user (manager or employee)
export const getMyProjects = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user._id;
    const userRole = req.user.role;

    let projects;
    
    if (userRole === "admin") {
      // Admin sees all projects
      projects = await Project.find()
        .populate("client", "name email")
        .populate("teamMembers", "name email role")
        .sort({ createdAt: -1 });
    } else if (userRole === "client") {
      // Client sees only their projects
      projects = await Project.find({ client: userId })
        .populate("client", "name email")
        .populate("teamMembers", "name email role")
        .sort({ createdAt: -1 });
    } else {
      // Manager and employee see projects they are assigned to
      projects = await Project.find({ teamMembers: userId })
        .populate("client", "name email")
        .populate("teamMembers", "name email role")
        .sort({ createdAt: -1 });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error in getMyProjects:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Assign team members to a project
export const assignTeamToProject = async (req, res) => {
  try {
    const { team } = req.body;
    
    if (!Array.isArray(team)) {
      return res.status(400).json({ message: "Team must be an array" });
    }

    // Filter out empty strings and validate user IDs
    const validTeamMembers = team.filter(id => id && id.trim() !== '');

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { teamMembers: validTeamMembers },
      { new: true }
    ).populate("teamMembers", "name email role");

    if (!updated) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ 
      message: "Team assigned successfully", 
      project: updated 
    });
  } catch (error) {
    console.error("Error assigning team:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
