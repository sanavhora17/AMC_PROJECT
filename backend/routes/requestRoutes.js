const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/ServiceRequest');

// 1. Submit New Request (From Customer Side)
router.post('/add', async (req, res) => {
    try {
        const newRequest = new ServiceRequest(req.body);
        await newRequest.save();
        res.status(201).json({ message: "Request saved to database!" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 2. Get All Requests (For Admin)
router.get('/all', async (req, res) => {
    try {
        const requests = await ServiceRequest.find()
            .populate('assignedTechnician', 'name email') // Technician ki details bhi mil jayengi
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. Assign Technician (Proper Assignment)
router.patch('/assign/:id', async (req, res) => {
    try {
        const { technicianId, technicianName } = req.body;
        const updatedRequest = await ServiceRequest.findByIdAndUpdate(
            req.params.id,
            { 
                assignedTechnician: technicianId, 
                engineerName: technicianName,
                status: 'Assigned' 
            },
            { new: true }
        );
        res.json(updatedRequest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. Update Status (For Technician/Admin - Complete/Reject)
router.put('/update-status/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedRequest = await ServiceRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(updatedRequest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;