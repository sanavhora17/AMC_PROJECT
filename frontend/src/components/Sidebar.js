import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {  
  LayoutDashboard, 
  Settings, 
  Package, 
  Users, 
  LogOut, 
  ClipboardList, 
  ShieldCheck,
  ChevronRight,
  BarChart3,
  CreditCard,
  UserCog,
  UserPlus // Naya Icon Assign Task ke liye
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin/login');
  };

  const isActive = (path) => 
    location.pathname === path 
      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" 
      : "text-gray-400 hover:text-white hover:bg-gray-800/50";

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 p-4 border-r border-gray-800 flex flex-col z-50">
      
      {/* BRANDING AREA */}
      <div className="flex items-center gap-3 px-2 mb-10 mt-2">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-blue-500/20 text-white">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h2 className="text-lg font-black tracking-tight text-white leading-none">AMC PRO</h2>
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Admin Panel</span>
        </div>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 ml-2">Main Menu</p>
        
        <Link to="/admin/dashboard" className={`flex items-center justify-between p-3 rounded-xl transition-all font-semibold ${isActive('/admin/dashboard')}`}>
          <div className="flex items-center gap-3">
            <LayoutDashboard size={20}/> <span>Dashboard</span>
          </div>
          {location.pathname === '/admin/dashboard' && <ChevronRight size={14} />}
        </Link>
        
        <Link to="/admin/services" className={`flex items-center gap-3 p-3 rounded-xl transition-all font-semibold ${isActive('/admin/services')}`}>
          <Settings size={20}/> <span>Manage Services</span>
        </Link>

        <Link to="/admin/plans" className={`flex items-center gap-3 p-3 rounded-xl transition-all font-semibold ${isActive('/admin/plans')}`}>
          <Package size={20}/> <span>AMC Plans</span>
        </Link>

        {/* --- OPERATIONS SECTION --- */}
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-8 mb-4 ml-2">Operations</p>
        
        <Link to="/admin/users" className={`flex items-center gap-3 p-3 rounded-xl transition-all font-semibold ${isActive('/admin/users')}`}>
          <Users size={20}/> <span>User List</span>
        </Link>

        <Link to="/admin/payments" className={`flex items-center gap-3 p-3 rounded-xl transition-all font-semibold ${isActive('/admin/payments')}`}>
          <CreditCard size={20}/> <span>Payment History</span>
        </Link>

        <Link to="/admin/requests" className={`flex items-center gap-3 p-3 rounded-xl transition-all font-semibold ${isActive('/admin/requests')}`}>
          <ClipboardList size={20}/> <span>Service Requests</span>
        </Link>

        {/* --- NAYA ADD KIYA GAYA OPTION: ASSIGN TASK --- */}
        <Link to="/admin/assign-task" className={`flex items-center gap-3 p-3 rounded-xl transition-all font-semibold ${isActive('/admin/assign-task')}`}>
          <UserPlus size={20} className="text-blue-400"/> <span>Assign Technician</span>
        </Link>

        <Link to="/admin/contracts" className={`flex items-center gap-3 p-3 rounded-xl transition-all font-semibold ${isActive('/admin/contracts')}`}>
          <ShieldCheck size={20}/> <span>AMC Contracts</span>
        </Link>

        <Link to="/admin/technicians" className={`flex items-center gap-3 p-3 rounded-xl transition-all font-semibold ${isActive('/admin/technicians')}`}>
          <UserCog size={20}/> <span>Manage Technicians</span>
        </Link>

        <Link to="/admin/reports" className={`flex items-center gap-3 p-3 rounded-xl transition-all font-semibold ${isActive('/admin/reports')}`}>
          <BarChart3 size={20}/> <span>Report Analysis</span>
        </Link>
      </nav>

      {/* LOGOUT BUTTON */}
      <div className="pt-4 border-t border-gray-800 mb-4 px-2">
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 p-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold text-sm group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform"/> <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;