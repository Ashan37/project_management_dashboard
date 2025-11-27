import Project from "../models/projectModel.js";
import ClientRequest from "../models/clientRequestModel.js";
import User from "../models/userModel.js";

// Get all clients (for admins/managers)
export const getAllClients = async (req, res) => {
  try {
    const clients = await User.find({ role: "client" })
      .select("-password")
      .sort({ createdAt: -1 });
    
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getClientRequests = async (req, res) => {
  try {
    const clientId = req.user._id;

    const projects = await Project.find({ client: clientId })
      .populate("client", "name email")
      .populate("teamMembers", "name email role");

    return res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching client requests:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getClientProjectById = async (req, res) => {
  try {
    const clientId = req.user._id;
    const project = await Project.findOne({
      _id: req.params.id,
      client: clientId,
    })
      .populate("client", "name email")
      .populate("teamMembers", "name email role");

    return res.status(200).json({ message: "Project not found" });
  } catch (error) {
    console.error("Error fetching client project by ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const submitClientRequest = async (req, res) => {
  try {
    const clientId = req.user_id;
    const { project, title, description, priority, attchments } = req.body;

    const projectObj = await Project.findById(project);
    if (!projectObj || projectObj.client.toString() !== clientId.toString()) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized" });
    }

    const cr = await ClientRequest.create({
      project,
      client: clientId,
      title,
      description,
      priority,
      attachments: attchments || [],
    });
    return res
      .status(201)
      .json({ message: "Client request submitted successfully", cr });
  } catch (error) {
    console.error("Error submitting client request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getClientRequestById = async (req, res) => {
  try {
    const clientId = req.user._id;

    const request = await ClientRequest.findOne({
      _id: req.params.id,
      client: clientId,
    })
      .populate("project")
      .populate("client", "name email");

    if (!request) return res.status(404).json({ message: "Request not found" });
    return res
      .status(200)
      .json({ message: "Request fetched successfully", request });
  } catch (error) {
    console.error("Error fetching client request by ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
