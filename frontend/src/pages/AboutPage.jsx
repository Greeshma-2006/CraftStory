import React from 'react';

const AboutPage = () => {

  return (

    <div className="bg-[#FFF9F3] min-h-screen">

      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="text-center mb-20">

          <h1 className="text-6xl font-bold text-[#6B3E2E] mb-6">
            About CraftStory
          </h1>

          <p className="max-w-3xl mx-auto text-lg text-[#6B3E2E]/80">
            CraftStory is a premium storytelling platform connecting
            authentic rural artisans with people who value handmade heritage,
            culture, and emotional craftsmanship.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* CUSTOMERS */}

          <div className="bg-white rounded-[30px] p-10 shadow-xl">

            <h2 className="text-4xl font-bold text-[#A44A32] mb-8">
              For Customers
            </h2>

            <ul className="space-y-5 text-[#6B3E2E] text-lg">

              <li>• Explore artisan stories</li>
              <li>• Discover handmade crafts</li>
              <li>• Login & register securely</li>
              <li>• Browse authentic products</li>
              <li>• Add items to wishlist</li>
              <li>• Manage cart & checkout</li>
              <li>• Track current orders</li>

            </ul>

          </div>

          {/* ARTISANS */}

          <div className="bg-white rounded-[30px] p-10 shadow-xl">

            <h2 className="text-4xl font-bold text-[#A44A32] mb-8">
              For Artisans
            </h2>

            <ul className="space-y-5 text-[#6B3E2E] text-lg">

              <li>• Register as artisan</li>
              <li>• Submit artisan journey</li>
              <li>• Upload craft images</li>
              <li>• Admin approval workflow</li>
              <li>• Add products after approval</li>
              <li>• Manage customer orders</li>
              <li>• Update delivery status</li>

            </ul>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AboutPage;