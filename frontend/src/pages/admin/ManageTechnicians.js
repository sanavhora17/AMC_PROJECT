import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Trash2 } from 'lucide-react';

const ManageTechnicians = () => {
  const [technicians, setTechnicians] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', specialization: '', phone: '' });

  
  const fetchTechs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/technicians');
      setTechnicians(res.data);
    } catch (err) {
      console.error("Error fetching technicians");
    }
  };

  useEffect(() => {
    fetchTechs();
  }, []);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/technicians/register', formData);
      alert("Technician Added Successfully!");
      setFormData({ name: '', email: '', specialization: '', phone: '' });
      fetchTechs();
    } catch (err) {
      alert("Error adding technician. Check if email is unique.");
    }
  };

  
  const deleteTech = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`http://localhost:5000/api/technicians/${id}`);
        fetchTechs();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Manage Technicians</h2>

      {/* --- FORM TO ADD NEW TECH --- */}
      <div style={styles.card}>
        <h3 style={styles.subHeading}><UserPlus size={20} /> Add New Technician</h3>
        <form onSubmit={handleSubmit} style={styles.formGrid}>
          <input 
            style={styles.input} 
            placeholder="Full Name" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required 
          />
          <input 
            style={styles.input} 
            placeholder="Email Address" 
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required 
          />
          <input 
            style={styles.input} 
            placeholder="Specialization (e.g. AC, RO)" 
            value={formData.specialization}
            onChange={(e) => setFormData({...formData, specialization: e.target.value})}
            required 
          />
          <input 
            style={styles.input} 
            placeholder="Phone Number" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required 
          />
          <button type="submit" style={styles.addBtn}>Register Technician</button>
        </form>
      </div>

      {/* --- TECHNICIAN LIST TABLE --- */}
      <div style={styles.card}>
        <h3 style={styles.subHeading}>Registered Technicians</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Specialization</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {technicians.length > 0 ? (
              technicians.map(tech => (
                <tr key={tech._id} style={styles.tr}>
                  <td style={styles.td}>{tech.name}</td>
                  <td style={styles.td}>{tech.email}</td>
                  <td style={styles.td}>{tech.specialization}</td>
                  <td style={styles.td}>
                    <button onClick={() => deleteTech(tech._id)} style={styles.deleteBtn}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{...styles.td, textAlign: 'center', color: '#94a3b8'}}>No technicians found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  // Sidebar fix: Margin added so content doesn't go under sidebar
  container: { padding: '40px', marginLeft: '256px', minHeight: '100vh', backgroundColor: '#f8fafc' },
  heading: { color: '#1e293b', fontSize: '28px', marginBottom: '30px', fontWeight: 'bold' },
  card: { backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', marginBottom: '30px' },
  subHeading: { display: 'flex', alignItems: 'center', gap: '10px', color: '#334155', marginBottom: '20px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' },
  addBtn: { gridColumn: 'span 2', backgroundColor: '#6366F1', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thRow: { borderBottom: '2px solid #f1f5f9', textAlign: 'left' },
  th: { padding: '15px', color: '#64748b', fontSize: '14px' },
  td: { padding: '15px', color: '#334155', fontSize: '14px', borderBottom: '1px solid #f1f5f9' },
  deleteBtn: { backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }
};

export default ManageTechnicians;