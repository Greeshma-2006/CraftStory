import React, { useEffect, useState, useCallback, useRef } from 'react';
import { orderService } from '../services';
import OrderStatusTracker from '../components/orders/OrderStatusTracker';
import { toast } from 'sonner';
import { PackageCheck } from 'lucide-react';

const POLL_INTERVAL = 5000; // 5 seconds — customer sees status within 5s of artisan updating

const CurrentOrders = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(null);
  const intervalRef           = useRef(null);

  // Silent fetch — no loading spinner, just updates data in background
  const fetchOrders = useCallback(async (silent = false) => {
    try {
      const response     = await orderService.getCustomerOrders();
      const activeOrders = response.data.data.filter(
        (order) => order.orderStatus !== 'Delivered'
      );
      setOrders(activeOrders);
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

  // Poll every 5 seconds silently — no spinner, no button needed
  useEffect(() => {
    intervalRef.current = setInterval(() => fetchOrders(true), POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [fetchOrders]);

  const handleMarkReceived = async (orderId) => {
    setMarking(orderId);
    try {
      await orderService.markOrderReceived(orderId);
      toast.success('Order marked as received! Moved to Previous Orders.');
      // Remove immediately from UI — no need to wait for next poll
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setMarking(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-[#C96A4A] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-16">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-12">
          <h1 className="text-5xl font-bold text-[#6B3E2E]">Current Orders</h1>
          <p className="mt-4 text-[#6B3E2E]/70">
            Track your active purchases — status updates automatically.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[35px] shadow-xl p-12 text-center">
            <h2 className="text-3xl font-bold text-[#6B3E2E]">No Active Orders</h2>
            <p className="mt-3 text-[#6B3E2E]/60">Orders you place will appear here.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-[35px] shadow-xl p-8">

                <div className="flex flex-col lg:flex-row justify-between gap-6 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-[#6B3E2E]">
                      {(order.products || order.items)?.map(
                        (item) => item.product?.name
                      ).join(', ')}
                    </h2>
                    <p className="mt-2 text-[#6B3E2E]/70">Artisan: {order.artisan?.name || '—'}</p>
                    <p className="mt-1 text-[#6B3E2E]/70 text-sm">Order ID: {order._id}</p>
                    {order.shippingAddress && (
                      <p className="mt-1 text-[#6B3E2E]/70 text-sm">
                        Delivering to: {order.shippingAddress}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[#A44A32] text-2xl font-bold">₹ {order.totalAmount}</p>
                    <p className="mt-2 text-[#6B3E2E]/70 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                    <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      order.paymentMethod === 'cod'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'}
                    </span>
                  </div>
                </div>

                <OrderStatusTracker currentStatus={order.orderStatus} />

                {order.orderStatus === 'Out For Delivery' && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => handleMarkReceived(order._id)}
                      disabled={marking === order._id}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-all disabled:opacity-60"
                    >
                      <PackageCheck size={18} />
                      {marking === order._id ? 'Updating...' : 'Mark as Received'}
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default CurrentOrders;
