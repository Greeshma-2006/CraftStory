import React from 'react';

const steps = [
  'Order Received',
  'Preparing',
  'Shipped',
  'Out For Delivery',
  'Delivered',
];

const OrderStatusTracker = ({
  currentStatus,
}) => {

  const currentIndex =
    steps.indexOf(currentStatus);

  return (

    <div className="bg-white rounded-[30px] shadow-xl p-8">

      <h2 className="text-2xl font-bold text-[#6B3E2E] mb-8">
        Order Tracking
      </h2>

      <div className="flex flex-col md:flex-row md:justify-between gap-6">

        {steps.map((step, index) => (

          <div
            key={step}
            className="flex flex-col items-center"
          >

            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                index <= currentIndex
                  ? 'bg-[#6D8B5A] text-white'
                  : 'bg-[#E7D5C7] text-[#6B3E2E]'
              }`}
            >
              {index + 1}
            </div>

            <p
              className={`mt-3 text-center text-sm font-medium ${
                index <= currentIndex
                  ? 'text-[#6D8B5A]'
                  : 'text-[#6B3E2E]'
              }`}
            >
              {step}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
};

export default OrderStatusTracker;