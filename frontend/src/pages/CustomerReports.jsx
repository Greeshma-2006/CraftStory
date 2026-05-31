import React, {
  useEffect,
  useState,
} from 'react';

import {
  adminService,
} from '../services';

import {
  toast,
} from 'sonner';

const CustomerReports = () => {

  const [reports,
    setReports] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    fetchReports();

  }, []);

  const fetchReports =
    async () => {

      try {

        const response =
          await adminService.getReports();

        setReports(
          response.data.data || []
        );

      } catch (error) {

        toast.error(
          'Failed to load reports'
        );

      } finally {

        setLoading(false);

      }
    };

  const updateStatus =
    async (
      reportId,
      status
    ) => {

      try {

        await adminService
          .updateReportStatus(
            reportId,
            {
              status,
            }
          );

        toast.success(
          'Report updated successfully'
        );

        fetchReports();

      } catch (error) {

        toast.error(
          error.response?.data?.message ||
          'Failed to update report'
        );

      }
    };

  const getStatusColor =
    (status) => {

      switch (status) {

        case 'Resolved':
          return 'bg-green-100 text-green-700';

        case 'In Review':
          return 'bg-yellow-100 text-yellow-700';

        default:
          return 'bg-red-100 text-red-700';
      }
    };

  if (loading) {

    return (

      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center">

        <div className="w-16 h-16 border-4 border-[#C96A4A] border-t-transparent rounded-full animate-spin"></div>

      </div>

    );
  }

  return (

    <div className="min-h-screen bg-[#FFF9F3] py-16">

      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-5xl font-bold text-[#6B3E2E] mb-10">

          Customer Feedback & Reports

        </h1>

        {reports.length === 0 ? (

          <div className="bg-white rounded-[30px] shadow-xl p-10 text-center">

            <h2 className="text-3xl font-bold text-[#6B3E2E]">

              No Reports Found

            </h2>

          </div>

        ) : (

          <div className="space-y-8">

            {reports.map(
              (report) => (

                <div
                  key={report._id}
                  className="bg-white rounded-[30px] shadow-xl p-8"
                >

                  <div className="flex flex-col lg:flex-row lg:justify-between gap-6">

                    <div>

                      <h2 className="text-2xl font-bold text-[#6B3E2E]">

                        Report #
                        {report._id.slice(-6)}

                      </h2>

                      <p className="mt-4 text-[#6B3E2E]">

                        <span className="font-semibold">

                          Customer:

                        </span>

                        {' '}
                        {report.customer?.name}

                      </p>

                      <p className="mt-2 text-[#6B3E2E]">

                        <span className="font-semibold">

                          Email:

                        </span>

                        {' '}
                        {report.customer?.email}

                      </p>

                      <p className="mt-4 text-[#6B3E2E] font-semibold">

                        Subject

                      </p>

                      <p className="mt-1 text-[#6B3E2E]/80">

                        {report.subject}

                      </p>

                      <p className="mt-4 text-[#6B3E2E] font-semibold">

                        Description

                      </p>

                      <p className="mt-1 text-[#6B3E2E]/80">

                        {report.description}

                      </p>

                    </div>

                    <div className="w-full lg:w-[260px]">

                      <div
                        className={`inline-block px-4 py-2 rounded-full font-medium mb-5 ${getStatusColor(
                          report.status
                        )}`}
                      >

                        {report.status}

                      </div>

                      <select
                        value={report.status}
                        onChange={(e) =>
                          updateStatus(
                            report._id,
                            e.target.value
                          )
                        }
                        className="w-full border border-[#E7D5C7] rounded-2xl px-4 py-3"
                      >

                        <option value="Pending">

                          Pending

                        </option>

                        <option value="In Review">

                          In Review

                        </option>

                        <option value="Resolved">

                          Resolved

                        </option>

                      </select>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>

        )}

      </div>

    </div>
  );
};

export default CustomerReports;