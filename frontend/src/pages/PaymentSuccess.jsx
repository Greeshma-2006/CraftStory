import React from 'react';

import {
  Link,
} from 'react-router-dom';

import {
  CheckCircle,
  ShoppingBag,
} from 'lucide-react';

const PaymentSuccess = () => {

  return (

    <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center px-6">

      <div className="bg-white rounded-[40px] shadow-2xl p-12 text-center max-w-2xl w-full">

        <CheckCircle
          size={90}
          className="mx-auto text-green-600"
        />

        <h1 className="text-5xl font-bold text-[#6B3E2E] mt-8">

          Order Placed Successfully

        </h1>

        <p className="mt-5 text-[#6B3E2E]/70 text-lg">

          Thank you for supporting authentic artisans
          and preserving handmade heritage.

        </p>

        <div className="bg-[#FFF9F3] rounded-[25px] p-6 mt-8">

          <p className="text-[#6B3E2E]/70">

            Your order has been received and will
            soon be processed by the artisan.

          </p>

        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center mt-10">

          <Link
            to="/current-orders"
            className="px-8 py-4 rounded-full bg-[#C96A4A] hover:bg-[#A44A32] text-white transition-all"
          >

            Track Order

          </Link>

          <Link
            to="/products"
            className="px-8 py-4 rounded-full border border-[#C96A4A] text-[#C96A4A] hover:bg-[#C96A4A] hover:text-white transition-all flex items-center justify-center gap-2"
          >

            <ShoppingBag size={18} />

            Continue Shopping

          </Link>

        </div>

      </div>

    </div>

  );
};

export default PaymentSuccess;