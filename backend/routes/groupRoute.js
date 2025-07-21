const express = require("express");
const groupRouter = express.Router();
const protect = require("../middleware/authMiddleware");
const Group = require("../models/groupChat");
const Project = require("../models/projectModel");

// Create the Group.
groupRouter.post("/create", protect, async (req, res) => {
    try {
        const { projectId, groupName } = req.body;
        const userId = req.user._id;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Check if the user is the project owner
        if (project.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Only the project owner can create a group" });
        }

        // Check if group already exists for this project
        const existingGroup = await Group.findOne({ projectId });
        if (existingGroup) {
            return res.status(400).json({ message: "Group already exists for this project" });
        }

        const group = await Group.create({
            projectId,
            groupName,
            admin: userId,
            members: [userId],
        });

        res.status(201).json({
            message: "Group created successfully",
            group,
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
});

groupRouter.post("/join-request/:groupId", protect, async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        if (group.members.includes(userId)) {
            return res.status(400).json({ message: "You are already a member of this group" });
        }

        if (group.joinRequests.includes(userId)) {
            return res.status(400).json({ message: "Join request already sent" });
        }

        group.joinRequests.push(userId);
        await group.save();

        res.status(200).json({ message: "Join request sent" });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

groupRouter.put("/accept-request/:groupId", protect, async (req, res) => {
    try {
        const { groupId } = req.params;
        const { userId } = req.body;

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Only admin can accept
        if (group.admin.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only group admin can accept requests" });
        }

        // Check if the user requested to join
        if (!group.joinRequests.includes(userId)) {
            return res.status(400).json({ message: "This user has not requested to join the group" });
        }

        // Remove from joinRequests
        group.joinRequests = group.joinRequests.filter(id => id.toString() !== userId.toString());

        // Add to members
        group.members.push(userId);

        await group.save();

        res.status(200).json({ message: "User added to the group" });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

groupRouter.put("/reject-request/:groupId", protect, async (req, res) => {
    try {
        const { groupId } = req.params;
        const { userId } = req.body;

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Only the admin can reject
        if (group.admin.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only the group admin can reject requests" });
        }

        // Check if user actually sent join request
        if (!group.joinRequests.includes(userId)) {
            return res.status(400).json({ message: "This user has not requested to join the group" });
        }

        // Remove the user from joinRequests
        group.joinRequests = group.joinRequests.filter(id => id.toString() !== userId.toString());

        await group.save();

        res.status(200).json({ message: "User's join request rejected" });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});


groupRouter.get("/my-groups", protect, async (req, res) => {
    try {
        const groups = await Group.find({ members: req.user._id });
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

groupRouter.get("/:groupId", protect, async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId)
            .populate("admin", "name email")
            .populate("members", "name email")
            .populate("joinRequests", "name email");

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Check if the user is a member or admin
        const isAuthorized = group.members.includes(req.user._id) || group.admin.toString() === req.user._id.toString();

        if (!isAuthorized) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

groupRouter.delete('/:groupId', protect, async (req, res) => {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.admin.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Only admin can delete group' });
    }

    await group.deleteOne();
    res.status(200).json({ message: 'Group deleted successfully' });
});

groupRouter.put('/leave/:groupId', protect, async (req, res) => {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (!group.members.includes(req.user._id)) {
        return res.status(400).json({ message: 'You are not a member of this group' });
    }

    group.members = group.members.filter(
        (memberId) => memberId.toString() !== req.user._id.toString()
    );

    await group.save();
    res.status(200).json({ message: 'You have left the group' });
});

groupRouter.put('/remove-member/:groupId', protect, async (req, res) => {
    const { userId } = req.body;
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.admin.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Only admin can remove members' });
    }

    if (!group.members.includes(userId)) {
        return res.status(400).json({ message: 'User is not a member' });
    }

    group.members = group.members.filter(
        (memberId) => memberId.toString() !== userId
    );

    await group.save();
    res.status(200).json({ message: 'Member removed successfully' });
});



module.exports = groupRouter;
