import React from 'react';

import { Link } from 'react-router-dom';

const CustomerDashboard = () => {

  return (

    <div className="min-h-screen bg-[#FFF9F3] py-16">

      <div className="max-w-7xl mx-auto px-6">

        <div className="bg-white rounded-[35px] shadow-xl p-10 mb-10">

          <p className="uppercase tracking-[5px] text-[#A44A32] font-semibold mb-3">

            Customer Dashboard

          </p>

          <h1 className="text-5xl font-bold text-[#6B3E2E]">

            Welcome To CraftStory

          </h1>

          <p className="mt-5 text-[#6B3E2E]/80 max-w-3xl">

            Discover authentic handmade creations,
            explore artisan journeys and support
            cultural craftsmanship.

          </p>

        </div>

        {/* QUICK ACTIONS */}

        <div className="grid lg:grid-cols-3 gap-8 mb-12">

          <Link
            to="/explore"
            className="bg-white rounded-[30px] shadow-xl p-8 hover:-translate-y-2 transition-all"
          >

            <h2 className="text-3xl font-bold text-[#6B3E2E] mb-4">

              Explore Artisans

            </h2>

            <p className="text-[#6B3E2E]/80">

              Discover artisan stories and heritage.

            </p>

          </Link>

          <Link
            to="/products"
            className="bg-white rounded-[30px] shadow-xl p-8 hover:-translate-y-2 transition-all"
          >

            <h2 className="text-3xl font-bold text-[#6B3E2E] mb-4">

              Shop Products

            </h2>

            <p className="text-[#6B3E2E]/80">

              Browse handmade products.

            </p>

          </Link>

          <Link
            to="/wishlist"
            className="bg-white rounded-[30px] shadow-xl p-8 hover:-translate-y-2 transition-all"
          >

            <h2 className="text-3xl font-bold text-[#6B3E2E] mb-4">

              Wishlist

            </h2>

            <p className="text-[#6B3E2E]/80">

              View saved products.

            </p>

          </Link>

        </div>

        {/* ORDERS */}

        <div className="grid lg:grid-cols-2 gap-8">

          <Link
            to="/current-orders"
            className="bg-white rounded-[35px] shadow-xl p-10 hover:-translate-y-2 transition-all"
          >

            <h2 className="text-4xl font-bold text-[#6B3E2E] mb-4">

              Current Orders

            </h2>

            <p className="text-[#6B3E2E]/80">

              Track active purchases and delivery progress.

            </p>

          </Link>

          <Link
            to="/previous-orders"
            className="bg-white rounded-[35px] shadow-xl p-10 hover:-translate-y-2 transition-all"
          >

            <h2 className="text-4xl font-bold text-[#6B3E2E] mb-4">

              Previous Orders

            </h2>

            <p className="text-[#6B3E2E]/80">

              View delivered and completed purchases.

            </p>

          </Link>

        </div>

      </div>

    </div>

  );
};

export default CustomerDashboard;