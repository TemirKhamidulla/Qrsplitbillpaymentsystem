import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Shield, UserCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export const StaffManagement: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New staff form state
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Waiter');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b219b36a/admin/staff`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setStaffList(data);
      }
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async () => {
    if (!newName || !newRole) return;
    
    try {
      const newStaff = {
        id: Date.now().toString(),
        name: newName,
        role: newRole,
        phone: newPhone,
        email: newEmail,
        status: 'Active',
      };
      
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b219b36a/admin/staff`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newStaff)
      });
      
      if (res.ok) {
        setShowAddForm(false);
        setNewName('');
        setNewPhone('');
        setNewEmail('');
        setNewPassword('');
        setNewRole('Waiter');
        fetchStaff();
      }
    } catch (error) {
      console.error("Failed to add staff:", error);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b219b36a/admin/staff/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      if (res.ok) {
        fetchStaff();
      }
    } catch (error) {
      console.error("Failed to delete staff:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-black/80">Team Members</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="lg-btn lg-btn-green lg-btn-sm flex items-center gap-2"
        >
          <Plus size={18} />
          Add Waiter
        </button>
      </div>

      <div className="bubble-card overflow-hidden">
        <div className="w-full overflow-x-auto relative z-10">
          {loading ? (
            <div className="p-8 text-center text-black/50">Loading staff data...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/5">
                  <th className="py-4 px-6 text-xs font-semibold text-black/40 uppercase tracking-wider">Name</th>
                  <th className="py-4 px-6 text-xs font-semibold text-black/40 uppercase tracking-wider">Role</th>
                  <th className="py-4 px-6 text-xs font-semibold text-black/40 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-black/40 uppercase tracking-wider">Phone</th>
                  <th className="py-4 px-6 text-xs font-semibold text-black/40 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {staffList.map((staff) => (
                  <tr key={staff.id} className="hover:bg-white/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-black/5 to-black/10 flex items-center justify-center font-bold text-black/60 text-xs">
                          {staff.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-black/80 text-sm">{staff.name}</div>
                          <div className="text-xs text-black/40">{staff.email || 'No email'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        {staff.role === 'Admin' || staff.role === 'Manager' ? <Shield size={14} className="text-[#007AFF]" /> : <UserCheck size={14} className="text-black/40" />}
                        <span className="text-sm font-medium text-black/70">{staff.role}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        staff.status === 'Active' ? 'bg-[#30D158]/10 text-[#28B54E]' : 'bg-black/5 text-black/40'
                      }`}>
                        {staff.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-black/60">{staff.phone || 'No phone'}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button className="bubble-icon w-8 h-8 text-black/50 hover:text-[#007AFF]">
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteStaff(staff.id)}
                          className="bubble-icon w-8 h-8 text-black/50 hover:text-[#FF453A]"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setShowAddForm(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="lg-card w-full max-w-md relative z-10 overflow-hidden"
            >
              <div className="p-6 border-b border-black/5 flex justify-between items-center">
                <h3 className="text-lg font-bold text-black/80">Add New Staff Member</h3>
                <button onClick={() => setShowAddForm(false)} className="bubble-icon w-8 h-8 text-black/50">
                  <X size={16} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-black/60 mb-1.5 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-black/5 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#30D158]/50" 
                    placeholder="e.g. Alibek" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-black/60 mb-1.5 ml-1">Role</label>
                    <select 
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full bg-black/5 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#30D158]/50 appearance-none"
                    >
                      <option>Waiter</option>
                      <option>Manager</option>
                      <option>Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-black/60 mb-1.5 ml-1">Phone</label>
                    <input 
                      type="tel" 
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full bg-black/5 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#30D158]/50" 
                      placeholder="+7..." 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-black/60 mb-1.5 ml-1">Email</label>
                  <input 
                    type="email" 
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-black/5 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#30D158]/50" 
                    placeholder="Email for login" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-black/60 mb-1.5 ml-1">Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-black/5 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#30D158]/50" 
                    placeholder="••••••••" 
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button onClick={() => setShowAddForm(false)} className="flex-1 lg-btn lg-btn-glass py-3 text-sm">Cancel</button>
                  <button onClick={handleAddStaff} className="flex-1 lg-btn lg-btn-green py-3 text-sm">Save Member</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
