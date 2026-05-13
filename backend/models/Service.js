const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String },
    imageUrl: { type:String,default:''},
    status: { type: String, default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);