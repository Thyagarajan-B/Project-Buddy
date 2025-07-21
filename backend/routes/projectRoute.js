const express = require('express');
const router = express.Router();
const Project = require('../models/projectModel');
const protect = require('../middleware/authMiddleware');

//Create a project post
router.post('/create', protect, async (req, res) => {
    try {
        const { title, description, rolesNeeded, teamSize } = req.body;

        if (!title || !description || !rolesNeeded || !teamSize) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const newProject = new Project({
            title,
            description,
            rolesNeeded,
            teamSize,
            createdBy: req.user.id
        });
        console.log("kasknaskakns");
        await newProject.save();
        return res.status(201).json({ success: true, message: "Project created", project: newProject });

    } catch (err) {
        return res.status(500).json({ success: false, message: "Error creating project", error: err.message });
    }
});

// Get all the projects
router.get('/getallprojects', async (req, res) => {
    try {
        const projects = await Project.find()
            .populate('createdBy', 'userName email')
            .populate('team', 'userName email')
            .sort({ createdAt: -1 });
        console.log(projects);

        return res.status(200).json({ success: true, projects });

    } catch (err) {
        return res.status(500).json({ success: false, message: "Error fetching projects", error: err.message });
    }
});


// Apply to a project (with message)
router.post('/:projectId/apply', protect, async (req, res) => {
    try {
        const { projectId } = req.params;
        const { portfolio, message } = req.body;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        if (project.team.length >= project.teamSize) {
            return res.status(400).json({ success: false, message: "Team is full" });
        }

        const userId = typeof req.user === 'object' ? req.user.id : req.user;

        // Check if user already applied
        const alreadyApplied = project.applicants.some(app => app.user.toString() === userId);
        if (alreadyApplied) {
            return res.status(400).json({ success: false, message: "You already applied to this project" });
        }

        // Add applicant
        project.applicants.push({
            user: userId,
            portfolio,
            message
        });

        await project.save();

        return res.status(200).json({ success: true, message: "Applied successfully" });

    } catch (err) {
        console.error("Error applying to project:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

// Accept or Reject the applicant
router.put('/:projectId/applicants/:userId', protect, async (req, res) => { 
    try {
        const { projectId, userId } = req.params;
        const { status } = req.body;

        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        if (project.createdBy.toString() !== req.user.id.toString()) {
            return res.status(403).json({ success: false, message: "Only the project creator can update applicant status" });
        }

        const applicant = project.applicants.find(app => app.user.toString() === userId);

        if (!applicant) {
            return res.status(404).json({ success: false, message: "Applicant not found" });
        }

        // If already accepted, do nothing
        if (applicant.status === status) {
            return res.status(200).json({ success: true, message: `Applicant already marked as ${status}` });
        }

        // If accepting, ensure team size isn't exceeded
        if (status === "accepted") {
            if (project.team.length >= project.teamSize) {
                return res.status(400).json({ success: false, message: "Team size limit reached" });
            }

            // Avoid duplicate push
            if (!project.team.includes(userId)) {
                project.team.push(userId);
            }
        } else {
            // If changing from accepted → rejected, remove from team
            project.team = project.team.filter(id => id.toString() !== userId);
        }

        // Update applicant status
        applicant.status = status;

        await project.save();

        return res.status(200).json({ success: true, message: `Applicant ${status} successfully` });

    } catch (err) {
        console.error("Error updating applicant status:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});


// Get the project cretaed by certain user using his token
router.get('/:projectId/applicants', protect, async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId).populate('applicants.user', 'name email');

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        if (project.createdBy.toString() !== req.user) {
            return res.status(403).json({ success: false, message: "Access denied: Not the project creator" });
        }

        return res.status(200).json({
            success: true,
            applicants: project.applicants
        });

    } catch (err) {
        console.error("Error getting applicants:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

// get all the projects created by me
router.get('/my-projects', protect, async (req, res) => {
    try {
        const projects = await Project.find({ createdBy: req.user.id })
            .populate("applicants.user", "name email")
            .exec();
        // console.log(String(projects[0].applicants[0].user._id), "hello");
        console.log(projects);
        return res.status(200).json({ success: true, projects: projects });
    } catch (err) {
        console.error("Error fetching my projects:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

// get the projects applied by me
router.get('/applied', protect, async (req, res) => {
    try {
        // Find projects where current user is in the applicants list
        const userId = typeof req.user === 'object' ? req.user.id : req.user;
        const projects = await Project.find({ "applicants.user": userId });

        // For each project, get the status of the current user's application
        const result = projects.map(project => {
            const myApplication = project.applicants.find(app => app.user.toString() === userId);

            return {
                _id: project._id,
                title: project.title,
                description: project.description,
                status: myApplication.status,
                createdBy: project.createdBy,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt
            };
        });

        return res.status(200).json({ success: true, projects: result });

    } catch (err) {
        console.error("Error fetching applied projects:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

// Edit the project detais only by creator 
router.put('/:projectId', protect, async (req, res) => {
    try {
        const { projectId } = req.params;
        const updates = req.body;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Only creator can edit
        if (project.createdBy.toString() !== req.user) {
            return res.status(403).json({ message: "Only the creator can edit this project" });
        }

        // Update allowed fields
        const allowedFields = ['title', 'description', 'techStack', 'roles', 'deadline'];
        allowedFields.forEach(field => {
            if (updates[field] !== undefined) {
                project[field] = updates[field];
            }
        });

        await project.save();
        res.json({ success: true, message: "Project updated successfully", project });

    } catch (err) {
        console.error("Edit error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// view the project team
router.get('/:projectId/team', protect, async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId)
            .populate('team', 'name email'); // only return name and email of teammates

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        if (project.createdBy.toString() !== req.user) {
            return res.status(403).json({ success: false, message: "Only project creator can view team members" });
        }

        return res.status(200).json({
            success: true,
            team: project.team,
        });

    } catch (err) {
        console.error("Error fetching team members:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

// delete an applicant from the project by creator of the project
router.delete('/:projectId/applicants/:userId', protect, async (req, res) => {
    try {
        const { projectId, userId } = req.params;

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        if (project.createdBy.toString() !== req.user) {
            return res.status(403).json({ message: "Access denied" });
        }

        project.applicants = project.applicants.filter(app => app.user.toString() !== userId);
        await project.save();

        return res.json({ success: true, message: "Applicant removed successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
});

//delete the project 
router.delete('/:projectId', protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        if (project.createdBy.toString() !== req.user) {
            return res.status(403).json({ message: "Only the creator can delete this project" });
        }

        await project.deleteOne();
        return res.json({ success: true, message: "Project deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
});

// Request to Leave a Project
router.post('/:projectId/leave-request', protect, async (req, res) => {
    try {
        const { message } = req.body;
        const { projectId } = req.params;

        const project = await Project.findById(projectId);

        if (!project) return res.status(404).json({ message: "Project not found" });

        const isTeamMember = project.team.includes(req.user);
        if (!isTeamMember) return res.status(403).json({ message: "Only team members can request to leave" });

        const alreadyRequested = project.leaveRequests.some(req => req.user.toString() === req.user && req.status === "pending");
        if (alreadyRequested) return res.status(400).json({ message: "Leave request already submitted" });

        project.leaveRequests.push({ user: req.user, message });

        await project.save();
        return res.status(200).json({ success: true, message: "Leave request submitted" });

    } catch (err) {
        console.error("Leave request error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

// Approve or Reject Leave Request
router.put('/:projectId/leave-request/:userId', protect, async (req, res) => {
    try {
        const { projectId, userId } = req.params;
        const { status } = req.body;

        console.log(status, "ksjdksjdosj");

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const project = await Project.findById(projectId);

        if (!project) return res.status(404).json({ message: "Project not found" });

        if (project.createdBy.toString() !== req.user) {
            return res.status(403).json({ message: "Only the creator can approve/reject leave requests" });
        }

        const request = project.leaveRequests.find(r => r.user.toString() === userId && r.status === "pending");
        if (!request) return res.status(404).json({ message: "Leave request not found or already processed" });

        request.status = status;

        if (status === "approved") {
            project.team = project.team.filter(id => id.toString() !== userId);
        }

        await project.save();

        return res.status(200).json({ success: true, message: `Leave request ${status}` });

    } catch (err) {
        console.error("Update leave request error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;