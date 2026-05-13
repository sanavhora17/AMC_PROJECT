const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// ✅ Payment/Booking save karo
router.post('/add', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json({ success: true, message: "Payment saved successfully!" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// ✅ Payment check karo email se
router.get('/check/:email', async (req, res) => {
    try {
        const booking = await Booking.findOne({
            userName: req.params.email,
            paymentStatus: 'Paid'
        });
        res.json({ paid: !!booking });
    } catch (err) {
        res.status(500).json({ paid: false });
    }
});

module.exports = router;