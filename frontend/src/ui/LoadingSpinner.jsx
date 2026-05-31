import React from 'react';

const LoadingSpinner = ({
  message = 'Loading...',
}) => {

  return (

    <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center">

      <div className="text-center">

        {/* Spinner */}

        <div className="relative">

          <div className="w-16 h-16 border-4 border-[#F5E6D3] rounded-full"></div>

          <div className="absolute inset-0 w-16 h-16 border-4 border-[#C96A4A] border-t-transparent rounded-full animate-spin"></div>

        </div>

        {/* Text */}

        <p className="mt-6 text-[#6B3E2E] font-medium text-lg">

          {message}

        </p>

      </div>

    </div>
  );
};

export default LoadingSpinner;