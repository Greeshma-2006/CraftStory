import React from 'react';

const AdminProfile = () => {

  const stats = {
    totalArtisans: 248,
    approved: 190,
    rejected: 28,
    pending: 30,
    products: 1248,
    orders: 3902,
  };

  return (

    <div className="min-h-screen bg-[#FFF9F3] py-16">

      <div className="max-w-7xl mx-auto px-6">

        <div className="bg-white rounded-[35px] shadow-xl p-10 mb-10">

          <h1 className="text-5xl font-bold text-[#6B3E2E]">
            Admin Profile
          </h1>

          <p className="mt-4 text-[#6B3E2E]/70">
            Platform administration overview
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="bg-white rounded-[30px] shadow-xl p-8">
            <h3 className="text-[#A44A32]">Total Artisans</h3>
            <p className="text-5xl font-bold mt-4">{stats.totalArtisans}</p>
          </div>

          <div className="bg-white rounded-[30px] shadow-xl p-8">
            <h3 className="text-green-600">Approved</h3>
            <p className="text-5xl font-bold mt-4">{stats.approved}</p>
          </div>

          <div className="bg-white rounded-[30px] shadow-xl p-8">
            <h3 className="text-yellow-600">Pending</h3>
            <p className="text-5xl font-bold mt-4">{stats.pending}</p>
          </div>

          <div className="bg-white rounded-[30px] shadow-xl p-8">
            <h3 className="text-red-600">Rejected</h3>
            <p className="text-5xl font-bold mt-4">{stats.rejected}</p>
          </div>

          <div className="bg-white rounded-[30px] shadow-xl p-8">
            <h3 className="text-[#A44A32]">Products</h3>
            <p className="text-5xl font-bold mt-4">{stats.products}</p>
          </div>

          <div className="bg-white rounded-[30px] shadow-xl p-8">
            <h3 className="text-[#A44A32]">Orders</h3>
            <p className="text-5xl font-bold mt-4">{stats.orders}</p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminProfile;