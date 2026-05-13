const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    // Isse User table se connect rakha hai
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // Isse Service table se connect rakha hai
    serviceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Service', 
        required: true 
    },
    userName: String,
    serviceTitle: String,
    amount: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    address: { type: String, required: true },
    
    // PAYMENT FIELDS (Updated Enum)
    paymentMethod: { 
        type: String, 
        // Yahan Card aur Net Banking add kar diya hai taaki validation fail na ho
        enum: ['UPI', 'Cash After Service', 'Bank Transfer', 'Card', 'Net Banking'], 
        default: 'UPI' 
    },
    
    // Naya: Payment details save karne ke liye fields
    upiId: { type: String, default: '' },
    cardNumber: { type: String, default: '' },
    accountNo: { type: String, default: '' },
    
    paymentScreenshot: { type: String, default: '' }, // Transaction Hash ya Image URL
    transactionId: { type: String, default: '' },   // Unique Txn ID ke liye
    
    paymentStatus: { 
        type: String, 
        enum: ['Pending', 'Paid', 'Failed'], 
        default: 'Pending' 
    },
    
    bookingStatus: { 
        type: String, 
        enum: ['New', 'In Progress', 'Completed', 'Cancelled'], 
        default: 'New' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);