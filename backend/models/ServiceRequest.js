const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema({
    requestId: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    customerPhone: { type: String },
    appliance: { type: String, required: true },
    issue: { type: String, required: true },
    description: { type: String },
    address: { type: String },
    preferredDate: { type: String },
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Assigned', 'Rejected', 'Completed'], 
        default: 'Pending' 
    },
    assignedTechnician: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Technician', 
        default: null 
    },
    engineerName: { type: String, default: 'Not Assigned' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);