const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    planName: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number,
        default: 0
    },
    paymentId: { 
        type: String 
    },
    status: { 
        type: String, 
        default: 'Active' 
    },
    startDate: { 
        type: Date, 
        default: Date.now 
    },
    expiryDate: { 
        type: Date,
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Contract', contractSchema);