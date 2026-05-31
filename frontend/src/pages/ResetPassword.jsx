import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services';
import { toast } from 'sonner';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, { password });
      toast.success('Password updated successfully! Please login with your new password.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center px-6">
      <div className="bg-white w-full max-w-lg rounded-[35px] shadow-2xl p-10">

        <div className="text-center mb-10">
          <Link to="/" className="text-4xl font-serif text-[#C96A4A] block mb-4">
            CraftStory
          </Link>
          <h1 className="text-4xl font-bold text-[#6B3E2E] mb-4">
            Reset Password
          </h1>
          <p className="text-[#6B3E2E]/80">
            Create a secure new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-[#E5D4C8] rounded-2xl px-5 py-4 outline-none focus:border-[#C96A4A] focus:ring-2 focus:ring-[#C96A4A]/20 transition-all"
            required
            minLength={6}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-[#E5D4C8] rounded-2xl px-5 py-4 outline-none focus:border-[#C96A4A] focus:ring-2 focus:ring-[#C96A4A]/20 transition-all"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-[#C96A4A] hover:bg-[#A44A32] text-white text-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : 'Update Password'}
          </button>
        </form>

        <p className="text-center mt-8">
          <Link to="/login" className="text-[#A44A32] font-semibold hover:underline">
            ← Back to Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default ResetPassword;
