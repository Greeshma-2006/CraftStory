import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail]   = useState('');
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      await authService.forgotPassword({ email });
      setSent(true);
      toast.success('Password reset link sent successfully');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to send reset email. Please try again.'
      );
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
            Forgot Password
          </h1>
          <p className="text-[#6B3E2E]/80">
            Enter your registered email address to receive
            password reset instructions.
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                  Sending...
                </>
              ) : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="bg-[#F5E6D3] p-5 rounded-2xl">
              <p className="text-[#6B3E2E] font-medium">
                Password reset link sent to <strong>{email}</strong>
              </p>
              <p className="text-[#6B3E2E]/70 text-sm mt-2">
                Check your inbox and click the link to reset your password.
                The link expires in 15 minutes.
              </p>
            </div>
          </div>
        )}

        <p className="text-center mt-8">
          <Link to="/login" className="text-[#A44A32] font-semibold hover:underline">
            ← Back to Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default ForgotPassword;
