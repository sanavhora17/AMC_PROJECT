const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Plan ka naam
    price: { type: Number, required: true }, // Kitne paise ka hai
    validity: { type: String, default: "1 Year" }, // Kab tak chalega
    
    // ⭐ YE LINE MISSING THI: Isse hi logo aur category save hogi
    type: { type: String, default: "Basic" }, 
    
    features: { type: [String] }, // Kya-kya milega isme
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plan', planSchema);