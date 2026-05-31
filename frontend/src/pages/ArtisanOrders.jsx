import React, { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { orderService } from '../services';
import { CheckCircle2, Phone, MapPin, Clock } from 'lucide-react';

const POLL_INTERVAL = 5000; // 5 seconds

const ORDER_STATUSES = [
  'Order Received',
  'Preparing',
  'Shipped',
  'Out For Delivery',
  'Delivered',
];

const STATUS_COLORS = {
  'Delivered':        'bg-green-100 text-green-700',
  'Out For Delivery': 'bg-blue-100 text-blue-700',
  'Shipped':          'bg-purple-100 text-purple-700',
  'Preparing':        'bg-yellow-100 text-yellow-700',
  'Order Received':   'bg-orange-100 text-orange-700',
};

const ArtisanOrders = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState('active');
  const intervalRef           = useRef(null);

  // Silent fetch — updates data without spinner
  const fetchOrders = useCallback(async (silent = false) => {
    try {
      const response = await orderService.getArtisanOrders();
      setOrders(response.data.data || []);
    } catch {
      if (!silent) toast.error('Failed to load orders');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchOrders(false);
  }, [fetchOrders]);

  // Poll every 5 seconds — artisan sees customer "Mark as Received" instantly
  useEffect(() => {
    intervalRef.current = setInterval(() => fetchOrders(true), POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [fetchOrders]);

  const updateStatus = async (orderId, orderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, { orderStatus });
      // Update locally immediately — don't wait for next poll
      setOrders((prev) =>
        prev.map((o) => o._id === orderId ? { ...o, orderStatus } : o)
      );
      toast.success('Order status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-[#C96A4A] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const activeOrders    = orders.filter((o) => o.orderStatus !== 'Delivered');
  const completedOrders = orders.filter((o) => o.orderStatus === 'Delivered');
  const shown           = tab === 'active' ? activeOrders : completedOrders;

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-16">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-10">
          <h1 className="text-5xl font-bold text-[#6B3E2E]">My Orders</h1>
          <p className="mt-3 text-[#6B3E2E]/70">
            Manage customer orders — updates automatically when customer marks received.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setTab('active')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              tab === 'active'
                ? 'bg-[#C96A4A] text-white'
                : 'border border-[#C96A4A] text-[#C96A4A] hover:bg-[#FFF3EE]'
            }`}
          >
            Active Orders
            {activeOrders.length > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                tab === 'active' ? 'bg-white/30' : 'bg-[#C96A4A] text-white'
              }`}>
                {activeOrders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('completed')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              tab === 'completed'
                ? 'bg-green-600 text-white'
                : 'border border-green-600 text-green-700 hover:bg-green-50'
            }`}
          >
            Completed Orders
            {completedOrders.length > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                tab === 'completed' ? 'bg-white/30' : 'bg-green-600 text-white'
              }`}>
                {completedOrders.length}
              </span>
            )}
          </button>
        </div>

        {shown.length === 0 ? (
          <div className="bg-white rounded-[35px] shadow-xl p-10 text-center">
            <h2 className="text-3xl font-bold text-[#6B3E2E]">
              {tab === 'active' ? 'No Active Orders' : 'No Completed Orders Yet'}
            </h2>
          </div>
        ) : (
          <div className="space-y-8">
            {shown.map((order) => (
              <div key={order._id} className="bg-white rounded-[35px] shadow-xl p-8">
                <div className="flex flex-col lg:flex-row lg:justify-between gap-8">

                  {/* LEFT */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        STATUS_COLORS[order.orderStatus] || STATUS_COLORS['Order Received']
                      }`}>
                        {order.orderStatus}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.paymentMethod === 'cod'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-teal-100 text-teal-700'
                      }`}>
                        {order.paymentMethod === 'cod' ? 'COD' : 'Paid Online'}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-[#6B3E2E] mb-1">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h2>
                    <p className="text-sm text-[#6B3E2E]/50 mb-4">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>

                    <div className="space-y-2 text-sm text-[#6B3E2E]/80">
                      <p className="font-semibold text-[#6B3E2E]">{order.customer?.name}</p>
                      <p>{order.customer?.email}</p>
                      <p className="flex items-center gap-1">
                        <Phone size={13} className="text-[#C96A4A]" />
                        {order.phoneNumber || order.customer?.phone || 'Phone not provided'}
                      </p>
                      {order.shippingAddress && (
                        <p className="flex items-start gap-1">
                          <MapPin size={13} className="text-[#C96A4A] mt-0.5 shrink-0" />
                          {order.shippingAddress}
                        </p>
                      )}
                    </div>
                    <p className="mt-4 text-[#A44A32] font-bold text-xl">₹ {order.totalAmount}</p>
                  </div>

                  {/* RIGHT */}
                  <div className="w-full lg:w-72 space-y-4">
                    <div className="bg-[#FFF9F3] rounded-2xl p-4 space-y-3">
                      {order.products?.map((item) => (
                        <div key={item._id} className="flex justify-between items-center text-sm">
                          <div>
                            <p className="font-semibold text-[#6B3E2E]">{item.product?.name}</p>
                            <p className="text-[#6B3E2E]/60">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-[#A44A32]">₹ {item.price || item.product?.price}</p>
                        </div>
                      ))}
                    </div>

                    {tab === 'active' && (
                      <div>
                        <label className="block text-sm font-semibold text-[#6B3E2E] mb-2">
                          Update Status
                        </label>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          className="w-full border border-[#E7D5C7] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#C96A4A]"
                        >
                          {ORDER_STATUSES.filter((s) => s !== 'Delivered').map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <p className="text-xs text-[#6B3E2E]/50 mt-2 flex items-center gap-1">
                          <Clock size={11} />
                          Customer confirms delivery when package arrives.
                        </p>
                      </div>
                    )}

                    {tab === 'completed' && (
                      <div className="flex items-center gap-2 text-green-700 font-semibold">
                        <CheckCircle2 size={18} />
                        Customer confirmed delivery
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ArtisanOrders;
