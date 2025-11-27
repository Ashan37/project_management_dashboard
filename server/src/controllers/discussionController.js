import Discussion from "../models/discussionModel.js";
import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";

// Helper function to extract mentions from message
const extractMentions = (message) => {
  const mentionRegex = /@\[([^\]]+)\]\(([a-f\d]{24})\)/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(message)) !== null) {
    mentions.push(match[2]); // Extract user ID
  }
  
  return [...new Set(mentions)]; // Remove duplicates
};

// Helper function to emit socket event
const emit = (req, event, payload) => {
  try {
    const io = req.app.get("io");
    if (io) io.emit(event, payload);
  } catch (err) {
    console.error("Socket emit error:", err.message);
  }
};

// Create a discussion message
export const createDiscussion = async (req, res) => {
  try {
    const { project, task, message, attachments } = req.body;
    const author = req.user._id;

    // Validate project access
    if (project) {
      const projectDoc = await Project.findById(project);
      if (!projectDoc) {
        return res.status(404).json({ message: "Project not found" });
      }
    }

    // Validate task access if provided
    if (task) {
      const taskDoc = await Task.findById(task);
      if (!taskDoc) {
        return res.status(404).json({ message: "Task not found" });
      }
    }

    // Extract mentions from message
    const mentions = extractMentions(message);

    const discussion = await Discussion.create({
      project: project || null,
      task: task || null,
      author,
      message,
      mentions,
      attachments: attachments || [],
    });

    await discussion.populate("author", "name email role");
    await discussion.populate("mentions", "name email");

    // Emit discussion created event
    emit(req, "discussionCreated", {
      projectId: project,
      taskId: task,
      discussion,
    });

    res.status(201).json({
      message: "Discussion posted successfully",
      discussion,
    });
  } catch (error) {
    console.error("Error creating discussion:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get discussions by project
export const getDiscussionsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { taskId } = req.query;

    const query = { project: projectId };
    if (taskId) {
      query.task = taskId;
    }

    const discussions = await Discussion.find(query)
      .populate("author", "name email role")
      .populate("mentions", "name email")
      .populate("reactions.user", "name")
      .sort({ createdAt: 1 });

    res.json(discussions);
  } catch (error) {
    console.error("Error fetching discussions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get discussions by task
export const getDiscussionsByTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const discussions = await Discussion.find({ task: taskId })
      .populate("author", "name email role")
      .populate("mentions", "name email")
      .populate("reactions.user", "name")
      .sort({ createdAt: 1 });

    res.json(discussions);
  } catch (error) {
    console.error("Error fetching task discussions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update discussion message
export const updateDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user._id;

    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    // Check if user is the author
    if (discussion.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this discussion" });
    }

    // Extract new mentions
    const mentions = extractMentions(message);

    discussion.message = message;
    discussion.mentions = mentions;
    discussion.isEdited = true;
    discussion.editedAt = new Date();

    await discussion.save();
    await discussion.populate("author", "name email role");
    await discussion.populate("mentions", "name email");

    // Emit update event
    emit(req, "discussionUpdated", {
      discussionId: id,
      discussion,
    });

    res.json({
      message: "Discussion updated successfully",
      discussion,
    });
  } catch (error) {
    console.error("Error updating discussion:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete discussion
export const deleteDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    // Only author or admin can delete
    if (discussion.author.toString() !== userId.toString() && userRole !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this discussion" });
    }

    await Discussion.findByIdAndDelete(id);

    // Emit delete event
    emit(req, "discussionDeleted", {
      discussionId: id,
      projectId: discussion.project,
      taskId: discussion.task,
    });

    res.json({ message: "Discussion deleted successfully" });
  } catch (error) {
    console.error("Error deleting discussion:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add reaction to discussion
export const addReaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    // Check if user already reacted with this emoji
    const existingReaction = discussion.reactions.find(
      (r) => r.user.toString() === userId.toString() && r.emoji === emoji
    );

    if (existingReaction) {
      // Remove reaction
      discussion.reactions = discussion.reactions.filter(
        (r) => !(r.user.toString() === userId.toString() && r.emoji === emoji)
      );
    } else {
      // Add reaction
      discussion.reactions.push({ user: userId, emoji });
    }

    await discussion.save();
    await discussion.populate("reactions.user", "name");

    // Emit reaction event
    emit(req, "discussionReaction", {
      discussionId: id,
      reactions: discussion.reactions,
    });

    res.json({
      message: "Reaction updated successfully",
      reactions: discussion.reactions,
    });
  } catch (error) {
    console.error("Error adding reaction:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
