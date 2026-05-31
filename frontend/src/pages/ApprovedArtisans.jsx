import React from 'react';

const artisans = [
  {
    name: 'Lakshmi Devi',
    email: 'lakshmi@gmail.com',
  },
  {
    name: 'Ravi Kumar',
    email: 'ravi@gmail.com',
  },
];

const ApprovedArtisans = () => {

  return (

    <div className="min-h-screen bg-[#FFF9F3] py-16">

      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-5xl font-bold text-green-700 mb-10">
          Approved Artisans
        </h1>

        <div className="grid gap-6">

          {artisans.map((artisan, index) => (

            <div
              key={index}
              className="bg-white rounded-[30px] shadow-xl p-8 flex justify-between"
            >

              <div>

                <h2 className="text-2xl font-bold text-[#6B3E2E]">
                  {artisan.name}
                </h2>

                <p>{artisan.email}</p>

              </div>

              <span className="bg-green-100 text-green-700 px-5 py-2 rounded-full h-fit">
                Approved
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default ApprovedArtisans;