const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    ph: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    // NAYI FIELDS:
    activePlan: { type: String, default: "No Active Plan" }, 
    role: { type: String, default: "user" } // Admin differentiate karne ke liye
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);