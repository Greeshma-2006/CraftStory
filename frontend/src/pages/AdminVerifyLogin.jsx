import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const AdminVerifyLogin = () => {
  const { token }             = useParams();
  const navigate              = useNavigate();
  const { verifyAdminLogin }  = useAuth();

  const [status, setStatus]   = useState('verifying');
  const [message, setMessage] = useState('');

  // useRef prevents double-call in React StrictMode
  const called = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token found.');
      return;
    }

    if (called.current) return;
    called.current = true;

    const verify = async () => {
      try {
        await verifyAdminLogin(token);
        setStatus('success');
        toast.success('Admin Login Verified Successfully');
        setTimeout(() => navigate('/admin/dashboard'), 1500);
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.data?.message ||
          'Invalid or expired verification link.'
        );
        toast.error('Verification failed');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9F3]">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl p-10 border border-[#E7D5C7] text-center">

        <Link to="/" className="text-4xl font-serif text-[#C96A4A] block mb-6">
          CraftStory
        </Link>

        {/* VERIFYING */}
        {status === 'verifying' && (
          <div>
            <div className="w-12 h-12 border-4 border-[#C96A4A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-serif text-[#6B3E2E] mb-2">
              Verifying Admin Login
            </h2>
            <p className="text-[#6B3E2E]/70">
              Please wait while we verify your identity...
            </p>
          </div>
        )}

        {/* SUCCESS */}
        {status === 'success' && (
          <div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif text-[#6B3E2E] mb-2">
              Admin Login Verified Successfully
            </h2>
            <p className="text-[#6B3E2E]/70">
              Redirecting to admin dashboard...
            </p>
          </div>
        )}

        {/* ERROR */}
        {status === 'error' && (
          <div>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif text-[#6B3E2E] mb-2">
              Verification Failed
            </h2>
            <p className="text-[#6B3E2E]/70 mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-block bg-[#C96A4A] hover:bg-[#A44A32] text-white px-6 py-3 rounded-2xl font-semibold transition-all"
            >
              Back to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminVerifyLogin;
