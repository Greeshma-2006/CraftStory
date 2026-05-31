import React from 'react';

const orders = [
  {
    id: 1,
    customer: 'Rahul Sharma',
    product: 'Handmade Terracotta Pot',
    status: 'Preparing',
    amount: '2499',
  },
  {
    id: 2,
    customer: 'Sneha Reddy',
    product: 'Traditional Wooden Artwork',
    status: 'Shipped',
    amount: '3999',
  },
];

const MyOrders = () => {

  return (

    <div className="min-h-screen bg-[#FFF9F3] py-20">

      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-14">

          <h1 className="text-5xl font-bold text-[#6B3E2E] mb-4">
            My Orders
          </h1>

          <p className="text-[#6B3E2E]/80">
            Manage customer purchases and delivery tracking.
          </p>

        </div>

        <div className="space-y-8">

          {orders.map((order) => (

            <div
              key={order.id}
              className="bg-white rounded-[30px] shadow-xl p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8"
            >

              <div>

                <h2 className="text-2xl font-bold text-[#6B3E2E]">
                  {order.product}
                </h2>

                <p className="mt-3 text-[#6B3E2E]/80">
                  Customer: {order.customer}
                </p>

              </div>

              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">

                <select
                  className="border border-[#E5D4C8] rounded-full px-5 py-3 outline-none"
                  defaultValue={order.status}
                >
                  <option>Order Received</option>
                  <option>Preparing</option>
                  <option>Shipped</option>
                  <option>Out For Delivery</option>
                  <option>Delivered</option>
                </select>

                <p className="text-[#A44A32] font-bold text-xl">
                  ₹ {order.amount}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default MyOrders;