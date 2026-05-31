import React, {
  useEffect,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import { toast } from 'sonner';

import {
  adminService,
} from '../services';

const AdminDashboard = () => {

  const [stats, setStats] =
    useState({

      totalArtisans: 0,

      approvedArtisans: 0,

      rejectedArtisans: 0,

      pendingRequests: 0,

      totalProducts: 0,

      totalOrders: 0,
    });

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    fetchDashboard();

  }, []);

  const fetchDashboard =
    async () => {

      try {

        const response =
          await adminService
            .getDashboardStats();

        setStats(
          response.data.data
        );

      } catch (error) {

        toast.error(
          'Failed to load dashboard'
        );

      } finally {

        setLoading(false);
      }
    };

  const statCards = [

    {
      title:
        'Total Artisans',

      value:
        stats.totalArtisans,
    },

    {
      title:
        'Approved Artisans',

      value:
        stats.approvedArtisans,
    },

    {
      title:
        'Rejected Artisans',

      value:
        stats.rejectedArtisans,
    },

    {
      title:
        'Pending Requests',

      value:
        stats.pendingRequests,
    },

    {
      title:
        'Total Products',

      value:
        stats.totalProducts,
    },

    {
      title:
        'Total Orders',

      value:
        stats.totalOrders,
    },
  ];

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F3]">

        <div className="w-16 h-16 border-4 border-[#C96A4A] border-t-transparent rounded-full animate-spin"></div>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#FFF9F3] py-16">

      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}

        <div className="bg-white rounded-[35px] shadow-xl p-10 mb-10">

          <p className="uppercase tracking-[5px] text-[#A44A32] font-semibold mb-3">

            Secure Admin Dashboard

          </p>

          <h1 className="text-5xl font-bold text-[#6B3E2E]">

            Platform Management

          </h1>

          <p className="mt-5 text-[#6B3E2E]/80 max-w-3xl">

            Manage artisan approvals,
            platform authenticity,
            customer reports,
            product moderation,
            and ecosystem trust.

          </p>

        </div>

        {/* STATS */}

        <div className="grid lg:grid-cols-3 gap-8 mb-12">

          {statCards.map(
            (
              item,
              index
            ) => (

              <div
                key={index}
                className="bg-white rounded-[30px] shadow-xl p-8"
              >

                <h2 className="text-[#A44A32] text-lg font-semibold">

                  {item.title}

                </h2>

                <p className="text-5xl font-bold text-[#6B3E2E] mt-5">

                  {item.value}

                </p>

              </div>
            )
          )}

        </div>

        {/* MANAGEMENT SECTIONS */}

        <div className="grid lg:grid-cols-3 gap-8">

          <Link
            to="/admin/pending"
            className="bg-white rounded-[30px] shadow-xl p-8 hover:-translate-y-2 transition-all"
          >

            <h2 className="text-3xl font-bold text-[#6B3E2E] mb-5">

              Pending Requests

            </h2>

            <p className="text-[#6B3E2E]/80 leading-relaxed">

              Review artisan submissions,
              stories,
              uploaded images,
              and authenticity verification.

            </p>

          </Link>

          <div className="bg-white rounded-[30px] shadow-xl p-8">

            <h2 className="text-3xl font-bold text-[#6B3E2E] mb-5">

              Approved Artisans

            </h2>

            <p className="text-[#6B3E2E]/80 leading-relaxed">

              View all approved artisans
              currently visible on
              CraftStory.

            </p>

          </div>

          <div className="bg-white rounded-[30px] shadow-xl p-8">

            <h2 className="text-3xl font-bold text-[#6B3E2E] mb-5">

              Rejected Artisans

            </h2>

            <p className="text-[#6B3E2E]/80 leading-relaxed">

              Review rejected artisan
              submissions and
              authenticity issues.

            </p>

          </div>

          <div className="bg-white rounded-[30px] shadow-xl p-8">

            <h2 className="text-3xl font-bold text-[#6B3E2E] mb-5">

              Revoked Artisans

            </h2>

            <p className="text-[#6B3E2E]/80 leading-relaxed">

              Manage revoked artisans,
              policy violations,
              and authenticity concerns.

            </p>

          </div>

          <div className="bg-white rounded-[30px] shadow-xl p-8">

            <h2 className="text-3xl font-bold text-[#6B3E2E] mb-5">

              Product Management

            </h2>

            <p className="text-[#6B3E2E]/80 leading-relaxed">

              Moderate artisan products,
              categories,
              and marketplace quality.

            </p>

          </div>

          <div className="bg-white rounded-[30px] shadow-xl p-8">

            <h2 className="text-3xl font-bold text-[#6B3E2E] mb-5">

              Customer Feedback & Reports

            </h2>

            <p className="text-[#6B3E2E]/80 leading-relaxed">

              Review complaints,
              customer reports,
              ratings,
              reviews,
              and trust issues.

            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;