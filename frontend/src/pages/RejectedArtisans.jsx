import React from 'react';

const artisans = [
  {
    name: 'John Artisan',
    email: 'john@gmail.com',
    reason:
      'Uploaded work does not meet authenticity requirements.',
  },
];

const RejectedArtisans = () => {

  return (

    <div className="min-h-screen bg-[#FFF9F3] py-16">

      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-5xl font-bold text-red-700 mb-10">
          Rejected Artisans
        </h1>

        {artisans.map((artisan, index) => (

          <div
            key={index}
            className="bg-white rounded-[30px] shadow-xl p-8"
          >

            <h2 className="text-2xl font-bold text-[#6B3E2E]">
              {artisan.name}
            </h2>

            <p className="mt-2">{artisan.email}</p>

            <p className="mt-5 text-red-600">
              {artisan.reason}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
};

export default RejectedArtisans;