const Plan = require('../models/Plan');

// 1. Create
exports.createPlan = async (req, res) => {
    try {
        const newPlan = new Plan(req.body);
        await newPlan.save();
        res.status(201).json(newPlan);
    } catch (err) { res.status(400).json(err); }
};

// 2. Get All
exports.getPlans = async (req, res) => {
    try {
        const plans = await Plan.find();
        res.status(200).json(plans);
    } catch (err) { res.status(500).json(err); }
};

// 3. Update (Iske bina Edit kaam nahi karega)
exports.updatePlan = async (req, res) => {
    try {
        const updated = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (err) { res.status(500).json(err); }
};

// 4. Delete (Iske bina Delete kaam nahi karega)
exports.deletePlan = async (req, res) => {
    try {
        await Plan.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Plan Deleted" });
    } catch (err) { res.status(500).json(err); }
};