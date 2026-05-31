import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService, uploadService } from '../services';
import { toast } from 'sonner';
import {
  User, Mail, Phone, Shield, Camera,
  Edit3, Save, X, Trash2, LogOut, AlertTriangle, Lock
} from 'lucide-react';

const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

const roleBadge = {
  admin:    { label: 'Admin',    color: 'bg-purple-100 text-purple-700 border-purple-200' },
  artisan:  { label: 'Artisan',  color: 'bg-amber-100  text-amber-700  border-amber-200'  },
  customer: { label: 'Customer', color: 'bg-teal-100   text-teal-700   border-teal-200'   },
};

const ProfilePage = () => {
  const { user, updateUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const nameParts = (user?.name || '').split(' ');
  const firstName = nameParts[0] || '';
  const lastName  = nameParts.slice(1).join(' ') || '';

  const [editing,         setEditing]         = useState(false);
  const [saving,          setSaving]           = useState(false);
  const [uploadingImg,    setUploadingImg]     = useState(false);
  const [showDeleteModal, setShowDeleteModal]  = useState(false);
  const [deleteConfirm,   setDeleteConfirm]    = useState('');
  const [deleting,        setDeleting]         = useState(false);

  const [form, setForm] = useState({
    firstName,
    lastName,
    email:        user?.email        || '',
    phone:        user?.phone        || '',
    profileImage: user?.profileImage || '',
  });

  const [formErrors, setFormErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!form.firstName.trim()) errors.firstName = 'First name is required';
    if (!form.lastName.trim())  errors.lastName  = 'Last name is required';
    if (!form.email.trim())     errors.email     = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = 'Enter a valid email';
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone))
      errors.phone = 'Enter a valid 10-digit phone number';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const fd = new FormData();
      fd.append('file', file); // ← FIXED: was 'image', must be 'file'
      const res = await uploadService.uploadImage(fd);
      setForm((f) => ({ ...f, profileImage: res.data.url }));
      toast.success('Photo updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const res = await authService.updateProfile(form);
      updateUser(res.data.data);
      toast.success('Profile Updated Successfully');
      setEditing(false);
      setFormErrors({});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({ firstName, lastName, email: user?.email || '', phone: user?.phone || '', profileImage: user?.profileImage || '' });
    setFormErrors({});
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged Out Successfully');
    navigate('/login');
  };

  const handleDelete = async () => {
    if (deleteConfirm !== 'DELETE') { toast.error('Type DELETE to confirm'); return; }
    setDeleting(true);
    try {
      await authService.deleteAccount();
      logout();
      toast.success('Account Deleted Successfully');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Deletion failed');
    } finally {
      setDeleting(false);
    }
  };

  const badge = roleBadge[user?.role] || roleBadge.customer;

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* HEADER CARD */}
        <div className="bg-white rounded-[32px] shadow-xl p-8 border border-[#E7D5C7]">
          <div className="flex flex-col sm:flex-row items-center gap-6">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {form.profileImage ? (
                <img src={form.profileImage} alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#E7D5C7] shadow-lg" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#C96A4A] flex items-center justify-center text-white text-3xl font-bold border-4 border-[#E7D5C7] shadow-lg">
                  {getInitials(user?.name)}
                </div>
              )}
              {editing && (
                <>
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploadingImg}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-[#C96A4A] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#A44A32] transition">
                    {uploadingImg
                      ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <Camera size={14} />}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </>
              )}
            </div>

            {/* Name + role */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-bold text-[#6B3E2E]">{user?.name}</h1>
              <p className="text-[#6B3E2E]/60 mt-1">{user?.email}</p>
              <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full border ${badge.color}`}>
                {badge.label}
              </span>
            </div>

            {!editing && (
              <button onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#C96A4A] text-white rounded-full text-sm font-semibold hover:bg-[#A44A32] transition shadow-md">
                <Edit3 size={15} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-[32px] shadow-xl p-8 border border-[#E7D5C7]">
          <h2 className="text-xl font-bold text-[#6B3E2E] mb-6">Profile Information</h2>
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First Name" icon={<User size={16} />} value={form.firstName} editing={editing} error={formErrors.firstName} onChange={(v) => setForm((f) => ({ ...f, firstName: v }))} />
              <Field label="Last Name"  icon={<User size={16} />} value={form.lastName}  editing={editing} error={formErrors.lastName}  onChange={(v) => setForm((f) => ({ ...f, lastName: v }))} />
            </div>
            <Field label="Full Name"     icon={<User size={16} />}   value={editing ? `${form.firstName} ${form.lastName}`.trim() : user?.name} editing={false} />
            <Field label="Email Address" icon={<Mail size={16} />}   value={form.email} editing={editing} error={formErrors.email} type="email" onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
            <Field label="Phone Number"  icon={<Phone size={16} />}  value={form.phone} editing={editing} error={formErrors.phone} placeholder="10-digit mobile number" onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
            <Field label="Role"          icon={<Shield size={16} />} value={user?.role} editing={false} />
          </div>

          {editing && (
            <div className="flex gap-3 mt-8">
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-[#C96A4A] text-white rounded-full font-semibold hover:bg-[#A44A32] transition shadow-md disabled:opacity-60">
                {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-3 bg-[#F5E6D3] text-[#6B3E2E] rounded-full font-semibold hover:bg-[#E7D5C7] transition">
                <X size={16} /> Cancel
              </button>
            </div>
          )}
        </div>

        {/* ACCOUNT ACTIONS */}
        <div className="bg-white rounded-[32px] shadow-xl p-8 border border-[#E7D5C7]">
          <h2 className="text-xl font-bold text-[#6B3E2E] mb-6">Account</h2>
          <div className="flex flex-col gap-4">
            <button onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-[#F5E6D3] text-[#6B3E2E] rounded-full font-semibold hover:bg-[#E7D5C7] transition w-fit">
              <LogOut size={16} /> Sign Out
            </button>

            {isAdmin ? (
              <div className="flex items-start gap-4 p-5 bg-purple-50 border border-purple-200 rounded-[20px]">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Lock size={18} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-bold text-purple-800 text-base">Administrator Account</p>
                  <p className="text-purple-600 text-sm mt-1">For platform security, this account cannot be deleted.</p>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-full font-semibold hover:bg-red-100 transition border border-red-200 w-fit">
                <Trash2 size={16} /> Delete Account
              </button>
            )}
          </div>
        </div>

      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-[28px] shadow-2xl p-8 max-w-md w-full border border-red-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#6B3E2E]">Delete Account</h3>
            </div>
            <p className="text-[#6B3E2E]/70 mb-6 leading-relaxed">
              Are you sure you want to permanently delete your account?
              This action <strong>cannot be undone</strong>.
            </p>
            <p className="text-sm font-semibold text-[#6B3E2E] mb-2">
              Type <code className="bg-red-50 px-1 rounded text-red-600">DELETE</code> to confirm:
            </p>
            <input type="text" value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              className="w-full px-4 py-3 rounded-2xl border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 mb-6 font-mono" />
            <div className="flex gap-3">
              <button onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); }}
                className="flex-1 px-4 py-3 bg-[#F5E6D3] text-[#6B3E2E] rounded-full font-semibold hover:bg-[#E7D5C7] transition">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting || deleteConfirm !== 'DELETE'}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition disabled:opacity-50">
                {deleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, icon, value, editing, error, type = 'text', placeholder, onChange }) => (
  <div>
    <label className="flex items-center gap-1.5 text-sm font-semibold text-[#6B3E2E] mb-1.5">
      <span className="text-[#C96A4A]">{icon}</span>
      {label}
    </label>
    {editing && onChange ? (
      <>
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-2xl border ${error ? 'border-red-400 focus:ring-red-300' : 'border-[#D9C4B5] focus:ring-[#C96A4A]'} focus:outline-none focus:ring-2 transition-all duration-200`} />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </>
    ) : (
      <div className="px-4 py-3 rounded-2xl bg-[#FFF9F3] border border-[#E7D5C7] text-[#6B3E2E] capitalize">
        {value || <span className="text-[#6B3E2E]/40 italic">Not provided</span>}
      </div>
    )}
  </div>
);

export default ProfilePage;
