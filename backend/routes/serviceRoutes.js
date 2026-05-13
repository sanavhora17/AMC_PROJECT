const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// 1. Show All Services
router.get('/all', async (req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: -1 });
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. For Add New Services (FIXED: Added imageUrl)
router.post('/add', async (req, res) => {
    // Yahan imageUrl ko bhi nikalna hoga req.body se
    const { title, price, description, imageUrl } = req.body; 
    
    const service = new Service({ 
        title, 
        price, 
        description, 
        imageUrl // Ab ye database mein jayega
    });
    
    try {
        const newService = await service.save();
        res.status(201).json(newService);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 3. For Edit Services (FIXED: Added imageUrl)
router.put('/:id', async (req, res) => {
    try {
        // Yahan bhi imageUrl add kiya gaya hai
        const { title, price, description, imageUrl } = req.body; 
        
        const updatedService = await Service.findByIdAndUpdate(
            req.params.id, 
            { title, price, description, imageUrl }, // Update query mein bhi shamil karein
            { new: true } 
        );

        if (!updatedService) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.json(updatedService);
    } catch (err) {
        res.status(400).json({ message: "Update fail: " + err.message });
    }
});

// 4. For Delete Services
router.delete('/:id', async (req, res) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id);
        if (!deletedService) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.json({ message: "Service deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;