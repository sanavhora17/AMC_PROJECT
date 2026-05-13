const Contract = require('../models/Contract');
const User = require('../models/User');

// 1. GET ALL CONTRACTS (Admin Panel - AMC List)
exports.getAdminContracts = async (req, res) => {
    try {
        const contracts = await Contract.find().populate('userId', 'name email ph address');
        
        const updatedContracts = contracts.map(contract => {
            const today = new Date();
            const expiry = new Date(contract.expiryDate);
            
            let status = "Active";
            if (today > expiry) {
                status = "Expired";
            } else {
                const diffTime = Math.abs(expiry - today);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays <= 30) status = "Renewal Due";
            }
            
            return {
                ...contract._doc,
                calculatedStatus: status 
            };
        });
        res.json(updatedContracts);
    } catch (err) {
        res.status(500).json({ message: "Error fetching contracts: " + err.message });
    }
};

// 2. BUY/CREATE CONTRACT (Is function ko check karein)
exports.buyContract = async (req, res) => {
    try {
        const { userId, planName, durationMonths, price, paymentId } = req.body;
        
        // Expiry date calculate karna
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + parseInt(durationMonths || 12));

        const newContract = new Contract({
            userId,
            planName,
            price: price || 0,
            paymentId: paymentId || "OFFLINE",
            expiryDate,
            status: "Approved"
        });

        const savedContract = await newContract.save();
        
        // Terminal mein check karne ke liye
        console.log("✅ New Contract Saved:", savedContract);

        // User profile update karna
        await User.findByIdAndUpdate(userId, { activePlan: planName });

        res.status(201).json({ message: "Contract Created!", newContract: savedContract });
    } catch (err) {
        console.error("❌ Save Error:", err.message);
        res.status(400).json({ message: err.message });
    }
};

// 3. DELETE/REJECT CONTRACT
exports.deleteContract = async (req, res) => {
    try {
        const contract = await Contract.findByIdAndDelete(req.params.id);
        if (!contract) return res.status(404).json({ message: "Not found" });

        await User.findByIdAndUpdate(contract.userId, { activePlan: "No Active Plan" });
        res.json({ message: "Contract Rejected" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 4. GET USER CONTRACTS
exports.getUserContracts = async (req, res) => {
    try {
        const contracts = await Contract.find({ userId: req.params.userId });
        res.json(contracts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};