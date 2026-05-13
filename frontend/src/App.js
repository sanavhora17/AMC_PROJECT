import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Sidebar Import 
import Sidebar from './components/Sidebar'; 

// --- ADMIN PAGES IMPORTS ---
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageServices from './pages/admin/ManageServices';
import PaymentHistory from './pages/admin/PaymentHistory';
import ServiceRequest from './pages/admin/ServiceRequest'; // Purani file
import AssignTask from './pages/admin/AssignTask'; // Nayi file jisme assign logic hai
import AmcPlans from './pages/admin/AmcPlans';
import UserList from './pages/admin/UserList';
import AMCContracts from './pages/admin/AMCContracts';
import ReportAnalysis from './pages/admin/ReportAnalysis';
import ManageTechnicians from './pages/admin/ManageTechnicians';

// --- CUSTOMER PAGES IMPORTS ---
import LandingPage from './pages/customer/LandingPage';
import AboutPage from './pages/customer/AboutPage';
import SuccessStories from './pages/customer/SuccessStories'; 
import ServicesPage from './pages/customer/ServicesPage';
import CustomerRegister from './pages/customer/CustomerRegister';
import CustomerLogin from './pages/customer/CustomerLogin';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerPlans from './pages/customer/CustomerPlans';
import Payment from './pages/customer/Payment';
import CustomerServicePage from './pages/customer/CustomerServicePage';
import Profile from './pages/customer/Profile';

// --- TECHNICIAN PAGES IMPORTS ---
import TechnicianLogin from './pages/technician/TechnicianLogin';
import TechnicianDashboard from './pages/technician/TechnicianDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/register" element={<CustomerRegister />} />
        <Route path="/login" element={<CustomerLogin />} />

        {/* --- CUSTOMER PRIVATE ROUTES --- */}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/plans" element={<CustomerPlans />} />
        <Route path="/customer/payment" element={<Payment />} />
        <Route path="/customer/book-service" element={<CustomerServicePage />} />
        <Route path="/customer/profile" element={<Profile/>} />

        {/* --- TECHNICIAN ROUTES --- */}
        <Route path="/technician/login" element={<TechnicianLogin />} />
        <Route path="/technician/dashboard" element={<TechnicianDashboard />} />

        {/* --- ADMIN AUTH --- */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* --- ADMIN PANEL WITH SIDEBAR --- */}
        <Route path="/admin/*" element={
          <div className="flex">
            <Sidebar /> 
            
            <div className="flex-1 bg-[#F8FAFC] min-h-screen">
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="payments" element={<PaymentHistory />} />
                
                {/* 1. Purani Service Requests File */}
                <Route path="requests" element={<ServiceRequest />} />
                
                {/* 2. Naya Assign Task Route (Jo Sidebar se connect hoga) */}
                <Route path="assign-task" element={<AssignTask />} />
                
                <Route path="contracts" element={<AMCContracts />} />
                <Route path="users" element={<UserList />} />
                <Route path="services" element={<ManageServices />} />
                <Route path="plans" element={<AmcPlans />} />
                <Route path="reports" element={<ReportAnalysis />} />
                <Route path="technicians" element={<ManageTechnicians />} />
              </Routes>
            </div>
          </div>
        } />

        {/* --- 404 PAGE --- */}
        <Route path="*" element={
          <div className="flex h-screen flex-col items-center justify-center bg-[#FDFDFF]">
            <h1 className="text-9xl font-black text-slate-100">404</h1>
            <p className="text-xl font-bold text-slate-400 -mt-10 uppercase tracking-widest">Page Not Found</p>
            <button 
              onClick={() => window.location.href = '/'} 
              className="mt-8 px-8 py-4 bg-[#6366F1] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-900 transition-all"
            >
              Back to Home
            </button>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;