import ClientRequest from "../models/clientRequestModel.js";

// Create a new client request
export const createClientRequest = async (req, res) => {
  try {
    const { projectId, type, title, description, priority } = req.body;

    if (!projectId || !type || !title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const clientRequest = await ClientRequest.create({
      client: req.user._id,
      projectId,
      type,
      title,
      description,
      priority: priority || "medium",
    });

    res.status(201).json({
      message: "Request submitted successfully",
      request: clientRequest,
    });
  } catch (error) {
    console.error("Error creating client request:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all client requests (for admin/manager)
export const getAllClientRequests = async (req, res) => {
  try {
    const requests = await ClientRequest.find()
      .populate("client", "name email")
      .populate("projectId", "name")
      .populate("respondedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching client requests:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get client requests for a specific client
export const getMyClientRequests = async (req, res) => {
  try {
    const requests = await ClientRequest.find({ client: req.user._id })
      .populate("projectId", "name")
      .populate("respondedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching client requests:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get client requests by project
export const getClientRequestsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const requests = await ClientRequest.find({ projectId })
      .populate("client", "name email")
      .populate("respondedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching project requests:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update client request status (admin/manager only)
export const updateClientRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;

    const updateData = { status };
    if (response) {
      updateData.response = response;
      updateData.respondedBy = req.user._id;
      updateData.respondedAt = new Date();
    }

    const updatedRequest = await ClientRequest.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
      .populate("client", "name email")
      .populate("projectId", "name")
      .populate("respondedBy", "name email");

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({
      message: "Request updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating client request:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete client request
export const deleteClientRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ClientRequest.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting client request:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
