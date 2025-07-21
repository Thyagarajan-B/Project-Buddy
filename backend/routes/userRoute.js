const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const User = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const upload = require("../middleware/upload");


// user register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // console.log(req.body);
        const user = await User.findOne({ email })
        if (user) {
            return res.status(401).json({ success: false, message: "User Already Exists" });
        }
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name, email, password: hashPassword
        });
        await newUser.save();
        return res.status(200).json({ success: true, message: "Account Created Successfully" });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ success: false, message: "Error in adding user" });
    }
});

// user login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: "User not Exists" });
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(401).json({ success: false, message: "Wrong Credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        console.log(token, "userRoute");

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                socialLinks: user.socialLinks || {},
            }
            , message: "Login Successfully"
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Error in login server" });
    }
});

// user profile
router.get('/profile', protect, (req, res) => {
    res.json({ msg: "User profile route (protected)", userId: req.user });
});

// verify user
router.get("/verify", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
});

// Update profile pic
router.put("/update-profile-pic", protect, upload.single("profilePic"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const imagePath = `/uploads/profile-pics/${req.file.filename}`;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { profilePic: imagePath },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to upload profile picture" });
    }
});

// Update the project ddetails
router.put('/update-details', protect, async (req, res) => {
    const { name, email, bio, socialLinks } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name, email, bio, socialLinks },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update user details" });
    }
});

module.exports = router;
