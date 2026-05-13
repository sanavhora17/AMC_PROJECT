const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 1. REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, ph, password, address } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered!" });
        }
        const newUser = new User({ name, email, ph, password, address });
        await newUser.save();
        res.status(201).json({ message: "Registration Successful!" });
    } catch (err) {
        res.status(500).json({ message: "Error: " + err.message });
    }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            res.json({ message: "Login Successful", user });
        } else {
            res.status(401).json({ message: "Invalid Email or Password!" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// 3. GET ALL USERS
router.get('/all', async (req, res) => {
    try {
        const users = await User.find({}).select('-password').lean();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
});

// 4. RESET PASSWORD
router.post('/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User with this email not found!" });
        }
        user.password = newPassword;
        await user.save();
        res.json({ success: true, message: "Password updated successfully! You can now login." });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error during password reset" });
    }
});

// 5. UPDATE USER
router.put('/update/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).select('-password');
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: "Update failed" });
    }
});

// 6. DELETE USER
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
});

// 7. GET USER BY ID — ✅ ID se backend se user fetch
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "User not found" });
    }
});

module.exports = router;