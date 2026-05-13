const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Booking = require('../models/Booking');
const Contract = require('../models/Contract');
const User = require('../models/User');

// --- 1. ADMIN LOGIN ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin || admin.password !== password) {
            return res.status(401).json({ success: false, message: "Invalid Admin Credentials" });
        }
        res.json({
            success: true,
            admin: { name: admin.name, email: admin.email, role: "Administrator" }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// --- 2. RESET PASSWORD ---
router.post('/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found!" });
        }
        admin.password = newPassword;
        await admin.save();
        res.json({ success: true, message: "Password updated successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// --- 3. GET ALL CONTRACTS (Dashboard + Report ke liye — price se revenue) ---
router.get('/contracts', async (req, res) => {
    try {
        const contracts = await Contract.find()
            .populate('userId', 'name email ph address')
            .sort({ createdAt: -1 })
            .lean();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const updatedContracts = contracts.map(c => {
            const expiry = new Date(c.expiryDate);
            expiry.setHours(0, 0, 0, 0);
            let calculatedStatus = 'Active';

            if (today > expiry) {
                calculatedStatus = 'Expired';
            } else {
                const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
                if (diffDays <= 30) calculatedStatus = 'Renewal Due';
            }

            return {
                ...c,
                calculatedStatus,
                // Dashboard ke liye normalize — amount field bhi set karo
                amount: c.price || 0,
                clientName: c.userId?.name || 'Unknown',
                expiryDate: c.expiryDate,
            };
        });

        res.status(200).json(updatedContracts);
    } catch (err) {
        console.error('GET /contracts Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// --- 4. GET DASHBOARD STATS (ek alag clean endpoint) ---
router.get('/dashboard-stats', async (req, res) => {
    try {
        const contracts = await Contract.find().lean();
        const users = await User.find().lean();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let active = 0, renewal = 0, expired = 0, totalRevenue = 0;

        contracts.forEach(c => {
            const price = parseFloat(c.price || 0);
            totalRevenue += price;

            const expiry = new Date(c.expiryDate);
            expiry.setHours(0, 0, 0, 0);

            if (today > expiry) {
                expired++;
            } else {
                const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
                if (diffDays <= 30) { renewal++; active++; }
                else active++;
            }
        });

        const uniqueClients = new Set(contracts.map(c => c.userId?.toString())).size;

        res.status(200).json({
            totalContracts: contracts.length,
            activeContracts: active,
            expiringIn30Days: renewal,
            expiredContracts: expired,
            totalRevenue: Math.round(totalRevenue),
            totalClients: uniqueClients,
            totalUsers: users.length,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// --- 5. CREATE CONTRACT/PAYMENT ---
router.post('/contracts/create', async (req, res) => {
    try {
        const { userId, userName, planName, amount, paymentMethod, transactionId, address, serviceId } = req.body;
        const newPayment = new Booking({
            userId,
            serviceId: serviceId || "65f1a2b3c4d5e6f7a8b9c0d1",
            userName,
            serviceTitle: planName,
            amount: amount || "0",
            paymentMethod: paymentMethod === 'Bank' ? 'Bank Transfer' : paymentMethod,
            paymentScreenshot: transactionId,
            paymentStatus: 'Paid',
            bookingStatus: 'New',
            address: address || "Online Subscription",
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        });
        await newPayment.save();
        res.json({ success: true, message: "Payment Record Created", data: newPayment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// --- 6. GET ALL PAYMENTS HISTORY ---
router.get('/payments/history', async (req, res) => {
    try {
        const history = await Booking.find().sort({ createdAt: -1 });
        res.json({ success: true, data: history });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching history" });
    }
});

// --- 7. GET ALL USERS ---
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}).select('-password').lean();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;