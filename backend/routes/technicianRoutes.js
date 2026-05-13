const express = require('express');
const router = express.Router();
const Technician = require('../models/Technician');
const ServiceRequest = require('../models/ServiceRequest');

// 1. REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, specialization, phone } = req.body;
        const existing = await Technician.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists!" });
        const newTech = new Technician({ name, email, specialization, phone });
        await newTech.save();
        res.status(201).json(newTech);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. GET ALL
router.get('/', async (req, res) => {
    try {
        const techs = await Technician.find().sort({ createdAt: -1 });
        res.json(techs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. DELETE
router.delete('/:id', async (req, res) => {
    try {
        await Technician.findByIdAndDelete(req.params.id);
        res.json({ message: "Technician deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email } = req.body;
        const tech = await Technician.findOne({ email });
        if (!tech) return res.status(404).json({ message: "Technician not found" });
        res.status(200).json(tech);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// 5. GET ASSIGNED TASKS
router.get('/tasks/:techId', async (req, res) => {
    try {
        const tasks = await ServiceRequest.find({ assignedTechnician: req.params.techId });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks" });
    }
});

// 6. ✅ UPDATE TASK STATUS — enum validated
router.patch('/tasks/update-status/:id', async (req, res) => {
    try {
        const { status } = req.body;

        // Enum ke saath match karo — ServiceRequest model ke valid values
        const validStatuses = ['Pending', 'Approved', 'Assigned', 'Rejected', 'Completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: `Invalid status. Valid values: ${validStatuses.join(', ')}` 
            });
        }

        const updated = await ServiceRequest.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ 
            success: true, 
            message: "Status updated successfully!", 
            data: updated 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;