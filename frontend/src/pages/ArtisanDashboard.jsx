import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { artisanService } from '../services';
import StatusBadge from '../components/common/StatusBadge';

const ArtisanDashboard = () => {
  const { user } = useAuth();
  const [artisanStatus, setArtisanStatus] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await artisanService.getMyProfile();
      // Profile exists — use its status
      setArtisanStatus(res.data.data?.status || 'pending');
    } catch (err) {
      // No profile yet — still pending
      setArtisanStatus('pending');
    } finally {
      setLoading(false);
    }
  };

  const isApproved = artisanStatus === 'approved';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F3]">
        <div className="w-16 h-16 border-4 border-[#C96A4A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="bg-white rounded-[35px] shadow-xl p-10 mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="uppercase tracking-[5px] text-[#A44A32] font-semibold mb-3">
                Artisan Dashboard
              </p>
              <h1 className="text-5xl font-bold text-[#6B3E2E]">
                Welcome Back, {user?.name?.split(' ')[0]}
              </h1>
              <p className="mt-5 text-[#6B3E2E]/80 max-w-2xl">
                Manage your handmade creations, artisan story,
                cultural identity, products, and customer orders.
              </p>
            </div>
            <StatusBadge status={artisanStatus} />
          </div>
        </div>

        {/* STATUS BANNER */}
        {!isApproved && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-[20px] p-5">
            <p className="text-amber-700 font-medium text-center">
              {artisanStatus === 'pending' && '⏳ Your profile is under review. Products and orders unlock once approved by admin.'}
              {artisanStatus === 'rejected' && '❌ Your profile was rejected. Please update your profile and resubmit.'}
              {artisanStatus === 'revoked' && '⚠️ Your approval has been revoked. Please contact support.'}
            </p>
          </div>
        )}

        {/* CARDS */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* PROFILE */}
          <Link
            to="/artisan/setup"
            className="bg-white rounded-[30px] shadow-xl p-8 hover:-translate-y-2 transition-all"
          >
            <h2 className="text-3xl font-bold text-[#6B3E2E] mb-5">
              Artisan Profile
            </h2>
            <p className="text-[#6B3E2E]/80 leading-relaxed">
              Complete your artisan profile, share your cultural
              journey, and upload your craft heritage story.
            </p>
            <span className="inline-block mt-6 text-[#C96A4A] font-semibold">
              {artisanStatus === 'pending' ? 'Edit Profile →' : 'View Profile →'}
            </span>
          </Link>

          {/* PRODUCTS */}
          {isApproved ? (
            <Link
              to="/artisan/products"
              className="bg-white rounded-[30px] shadow-xl p-8 hover:-translate-y-2 transition-all"
            >
              <h2 className="text-3xl font-bold text-[#6B3E2E] mb-5">
                My Products
              </h2>
              <p className="text-[#6B3E2E]/80 leading-relaxed">
                Upload and manage your handmade products.
              </p>
              <span className="inline-block mt-6 text-[#C96A4A] font-semibold">
                Manage Products →
              </span>
            </Link>
          ) : (
            <div className="bg-white rounded-[30px] shadow-xl p-8 opacity-70">
              <h2 className="text-3xl font-bold text-[#6B3E2E] mb-5">
                My Products
              </h2>
              <p className="text-[#6B3E2E]/80 leading-relaxed">
                Upload and manage handmade products after
                approval from the admin team.
              </p>
              <div className="mt-6 bg-yellow-100 border border-yellow-300 rounded-2xl p-4">
                <p className="text-yellow-700 font-medium">
                  Product upload unlocks after approval.
                </p>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {isApproved ? (
            <Link
              to="/artisan/orders"
              className="bg-white rounded-[30px] shadow-xl p-8 hover:-translate-y-2 transition-all"
            >
              <h2 className="text-3xl font-bold text-[#6B3E2E] mb-5">
                My Orders
              </h2>
              <p className="text-[#6B3E2E]/80 leading-relaxed">
                Track current orders, update delivery status,
                and manage customer purchases.
              </p>
              <span className="inline-block mt-6 text-[#C96A4A] font-semibold">
                View Orders →
              </span>
            </Link>
          ) : (
            <div className="bg-white rounded-[30px] shadow-xl p-8 opacity-70">
              <h2 className="text-3xl font-bold text-[#6B3E2E] mb-5">
                My Orders
              </h2>
              <p className="text-[#6B3E2E]/80 leading-relaxed">
                Track current orders, update delivery status,
                and manage customer purchases.
              </p>
              <div className="mt-6 bg-yellow-100 border border-yellow-300 rounded-2xl p-4">
                <p className="text-yellow-700 font-medium">
                  Order management unlocks after approval.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ArtisanDashboard;
