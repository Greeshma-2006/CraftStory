import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);

  // ── EMAIL VALIDATION (accept any valid email) ────────────────────────────
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Enter a valid email address');
      return false;
    }
    return true;
  };

  // ── SUBMIT ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) return;

    setLoading(true);

    try {
      const res = await login({ email, password });

      // ADMIN — backend sends verification email; no token yet
      if (res.data.requiresVerification) {
        toast.success(
          'Verification email sent. Please click the link in your email to complete login.'
        );
        return;
      }

      const role = res.data.data.user?.role;

      toast.success('Login successful!');

      if (role === 'artisan') {
        navigate('/artisan/dashboard');
      } else if (role === 'customer') {
        navigate('/customer/dashboard');
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex bg-[#FFF9F3]">

      {/* LEFT IMAGE SECTION */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="/crafts.png"
          alt="CraftStory"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Light uniform overlay — just enough to make white text readable */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center px-10">
          <div className="text-center max-w-xl">
            <p className="uppercase tracking-[5px] text-white/90 mb-4 font-semibold text-sm"
               style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
              Handcrafted Heritage Platform
            </p>
            <h1 className="text-5xl font-serif mb-5 leading-tight text-white"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.35)' }}>
              Every Craft<br />Tells a Story
            </h1>
            <p className="text-base leading-relaxed text-white/85"
               style={{ textShadow: '0 1px 4px rgba(0,0,0,0.35)' }}>
              Continue your journey through authentic artisan stories,
              handmade traditions, and meaningful cultural craftsmanship.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-4">
        <div className="w-full max-w-xl bg-white rounded-[36px] shadow-2xl p-8 md:p-10 border border-[#E7D5C7]">

          {/* HEADER */}
          <div className="mb-10 text-center">
            <Link to="/" className="text-5xl font-serif text-[#C96A4A]">
              CraftStory
            </Link>
            <h1 className="text-5xl font-serif mt-5 text-[#6B3E2E]">
              Welcome Back
            </h1>
            <p className="text-[#6B3E2E]/70 mt-3 text-base">
              Continue your handcrafted cultural journey
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* EMAIL */}
            <div>
              <label className="block mb-2 font-semibold text-[#6B3E2E]">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full px-4 py-3 rounded-2xl border border-[#D9C4B5] focus:outline-none focus:ring-2 focus:ring-[#C96A4A] hover:border-[#C96A4A] transition-all duration-300"
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold text-[#6B3E2E]">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-[#A44A32] text-sm font-semibold hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-2xl border border-[#D9C4B5] focus:outline-none focus:ring-2 focus:ring-[#C96A4A] hover:border-[#C96A4A] transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-4 text-[#6B3E2E]/60"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C96A4A] hover:bg-[#A44A32] transition-all duration-300 text-white py-3 rounded-2xl font-semibold text-lg shadow-xl hover:scale-[1.01]"
            >
              {loading ? 'Signing In...' : 'Login'}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-center mt-6 text-[#6B3E2E]/70">
            Don't have an account?
            <Link to="/register" className="text-[#A44A32] font-bold hover:underline ml-2">
              Register here
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
};

export default LoginPage;
