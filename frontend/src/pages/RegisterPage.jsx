import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadService } from '../services';
import { toast } from 'sonner';
import { Eye, EyeOff, Camera } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const fileInputRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [uploading,    setUploading]    = useState(false);

  const [formData, setFormData] = useState({
    firstName:    '',
    lastName:     '',
    email:        '',
    phone:        '',
    password:     '',
    role:         'customer',
    profileImage: '',
  });

  // PROFILE PHOTO UPLOAD
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await uploadService.uploadImage(fd);
      setFormData((f) => ({ ...f, profileImage: res.data.url }));
      toast.success('Photo uploaded!');
    } catch {
      toast.error('Photo upload failed');
    } finally {
      setUploading(false);
    }
  };

  // VALIDATION
  const validateForm = () => {
    const emailRegex    = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex    = /^\d{10}$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

    if (!emailRegex.test(formData.email)) {
      toast.error('Enter a valid email address');
      return false;
    }
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Phone number must be exactly 10 digits');
      return false;
    }
    if (!passwordRegex.test(formData.password)) {
      toast.error('Password must be at least 8 characters with 1 number and 1 special character');
      return false;
    }
    return true;
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const safeData = {
        ...formData,
        role: formData.role === 'artisan' ? 'artisan' : 'customer',
      };
      const res  = await register(safeData);
      const role = res.data.data.user?.role;
      toast.success(
        role === 'artisan'
          ? 'Account created! Please complete your artisan profile.'
          : 'Welcome to CraftStory!'
      );
      navigate(role === 'artisan' ? '/artisan/setup' : '/customer/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const initials = [formData.firstName[0], formData.lastName[0]].filter(Boolean).join('').toUpperCase();

  return (
    <div className="min-h-screen overflow-auto flex bg-[#FFF9F3]">

      {/* LEFT IMAGE */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img src="/crafts.png" alt="CraftStory" className="absolute inset-0 w-full h-full object-cover" />
        {/* Light uniform overlay — just enough to make white text readable */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center px-10">
          <div className="text-center max-w-xl">
            <p className="uppercase tracking-[5px] text-white/90 mb-4 font-semibold text-sm"
               style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
              Join The Heritage Movement
            </p>
            <h1 className="text-5xl font-serif mb-5 leading-tight text-white"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.35)' }}>
              Become Part of<br />CraftStory
            </h1>
            <p className="text-base leading-relaxed text-white/85"
               style={{ textShadow: '0 1px 4px rgba(0,0,0,0.35)' }}>
              Celebrate authentic handmade traditions, artisan identity, and meaningful cultural storytelling.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="w-full lg:w-1/2 flex items-start justify-center px-5 py-10">
        <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl px-8 py-8 border border-[#E7D5C7]">

          {/* HEADER */}
          <div className="text-center mb-6">
            <Link to="/" className="text-4xl font-serif text-[#C96A4A]">CraftStory</Link>
            <h2 className="text-4xl font-serif mt-3 text-[#6B3E2E]">Create Account</h2>
            <p className="text-[#6B3E2E]/70 mt-1 text-sm">Become part of a handcrafted storytelling ecosystem</p>
          </div>

          {/* PROFILE PHOTO */}
          <div className="flex flex-col items-center mb-6">
            <div
              className="relative w-20 h-20 rounded-full cursor-pointer group"
              onClick={() => !uploading && fileInputRef.current?.click()}
            >
              {formData.profileImage ? (
                <img src={formData.profileImage} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-[#E7D5C7] shadow-lg" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#C96A4A]/20 border-4 border-dashed border-[#C96A4A]/50 flex items-center justify-center">
                  {initials ? (
                    <span className="text-2xl font-bold text-[#C96A4A]">{initials}</span>
                  ) : (
                    <Camera size={24} className="text-[#C96A4A]/60" />
                  )}
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {uploading
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Camera size={18} className="text-white" />}
              </div>
            </div>
            <p className="text-xs text-[#6B3E2E]/50 mt-2">
              {formData.profileImage ? 'Click to change photo' : 'Click to add profile photo (optional)'}
            </p>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </div>

          {/* ROLE */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            {['customer', 'artisan'].map((r) => (
              <button key={r} type="button"
                onClick={() => setFormData({ ...formData, role: r })}
                className={`py-4 px-4 rounded-2xl border transition-all duration-300 text-left ${
                  formData.role === r
                    ? 'border-[#C96A4A] bg-[#FFF3EE] shadow-lg'
                    : 'border-[#E5D4C8] bg-white hover:border-[#C96A4A]'
                }`}
              >
                <h3 className="font-semibold text-lg text-[#6B3E2E] capitalize">{r}</h3>
                <p className="text-xs text-[#6B3E2E]/60 mt-1">
                  {r === 'customer' ? 'Explore authentic handmade treasures' : 'Share your handmade heritage story'}
                </p>
              </button>
            ))}
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5 font-semibold text-[#6B3E2E] text-sm">First Name</label>
                <input type="text" value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value.replace(/[^A-Za-z]/g,'') })}
                  placeholder="First name"
                  className="w-full px-4 py-3 rounded-2xl border border-[#D9C4B5] focus:outline-none focus:ring-2 focus:ring-[#C96A4A]" required />
              </div>
              <div>
                <label className="block mb-1.5 font-semibold text-[#6B3E2E] text-sm">Last Name</label>
                <input type="text" value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value.replace(/[^A-Za-z]/g,'') })}
                  placeholder="Last name"
                  className="w-full px-4 py-3 rounded-2xl border border-[#D9C4B5] focus:outline-none focus:ring-2 focus:ring-[#C96A4A]" required />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 font-semibold text-[#6B3E2E] text-sm">Email Address</label>
              <input type="email" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                className="w-full px-4 py-3 rounded-2xl border border-[#D9C4B5] focus:outline-none focus:ring-2 focus:ring-[#C96A4A]" required />
            </div>

            <div>
              <label className="block mb-1.5 font-semibold text-[#6B3E2E] text-sm">Phone Number</label>
              <input type="tel" value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g,'').slice(0,10) })}
                placeholder="10-digit phone number"
                className="w-full px-4 py-3 rounded-2xl border border-[#D9C4B5] focus:outline-none focus:ring-2 focus:ring-[#C96A4A]" required />
            </div>

            <div>
              <label className="block mb-1.5 font-semibold text-[#6B3E2E] text-sm">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create strong password"
                  className="w-full px-4 py-3 rounded-2xl border border-[#D9C4B5] focus:outline-none focus:ring-2 focus:ring-[#C96A4A]" required />
                <button type="button" className="absolute right-4 top-3.5 text-[#6B3E2E]/60"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading || uploading}
              className="w-full bg-[#C96A4A] hover:bg-[#A44A32] transition-all duration-300 text-white py-3.5 rounded-2xl font-semibold text-lg shadow-xl disabled:opacity-60">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-5 text-[#6B3E2E]/70 text-sm">
            Already have an account?
            <Link to="/login" className="text-[#A44A32] font-bold hover:underline ml-2">Login here</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
