const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const planRoutes = require('./routes/planRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const requestRoutes = require('./routes/requestRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contractRoutes = require('./routes/contractRoutes');
const technicianRoutes = require('./routes/technicianRoutes');
// ✅ NEW
const bookingRoutes = require('./routes/bookingRoutes');

dotenv.config();
const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));
app.use(express.json());

app.use('/api/plans', planRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/technicians', technicianRoutes);
// ✅ NEW
app.use('/api/bookings', bookingRoutes);

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/amc-database";
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.log('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

app.get('/', (req, res) => {
    res.send('🚀 Backend Server is Running Perfectly!');
});

app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err.stack);
  res.status(500).json({
      success: false,
      message: 'Server side par koi issue hai!',
      error: err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n=========================================`);
    console.log(`🚀 Server is flying on port: ${PORT}`);
    console.log(`🔗 Tech API Path: http://localhost:${PORT}/api/technicians`);
    console.log(`🔗 Request API Path: http://localhost:${PORT}/api/requests`);
    console.log(`🔗 Booking API Path: http://localhost:${PORT}/api/bookings`);
    console.log(`=========================================\n`);
});