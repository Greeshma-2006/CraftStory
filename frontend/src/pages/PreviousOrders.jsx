import React, { useEffect, useState } from 'react';
import { orderService, reviewService } from '../services';
import { toast } from 'sonner';
import { Star, CheckCircle2 } from 'lucide-react';

const StarPicker = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map((s) => (
      <button key={s} type="button" onClick={() => onChange(s)}>
        <Star size={24} className={s <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
      </button>
    ))}
  </div>
);

const PreviousOrders = () => {
  const [orders,      setOrders]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  // KEY: `${orderId}_${productId}` — unique per order+product
  // Allows same product bought multiple times to each get their own review
  const [reviewState, setReviewState] = useState({});

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const response  = await orderService.getCustomerOrders();
      const delivered = response.data.data.filter((o) => o.orderStatus === 'Delivered');
      setOrders(delivered);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getKey = (orderId, productId) => `${orderId}_${productId}`;

  const toggleReview = (orderId, productId) => {
    const key = getKey(orderId, productId);
    setReviewState((prev) => ({
      ...prev,
      [key]: {
        open:       !prev[key]?.open,
        rating:     prev[key]?.rating    ?? 5,
        text:       prev[key]?.text      ?? '',
        submitting: false,
        submitted:  prev[key]?.submitted ?? false,
      },
    }));
  };

  const submitReview = async (orderId, productId) => {
    const key = getKey(orderId, productId);
    const rs  = reviewState[key];
    if (!rs?.text?.trim()) { toast.error('Please write a review'); return; }

    setReviewState((prev) => ({ ...prev, [key]: { ...prev[key], submitting: true } }));
    try {
      // Pass orderId so backend checks per-order uniqueness
      await reviewService.addReview(productId, {
        rating:  rs.rating,
        review:  rs.text,
        orderId, // ← KEY FIX: tells backend which order this review is for
      });
      toast.success('Review submitted!');
      setReviewState((prev) => ({
        ...prev,
        [key]: { ...prev[key], submitting: false, submitted: true, open: false },
      }));
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to submit review');
      setReviewState((prev) => ({ ...prev, [key]: { ...prev[key], submitting: false } }));
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
          <h1 className="text-5xl font-bold text-[#6B3E2E]">Previous Orders</h1>
          <p className="mt-4 text-[#6B3E2E]/70">Your delivered orders and reviews.</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[35px] shadow-xl p-12 text-center">
            <h2 className="text-3xl font-bold text-[#6B3E2E]">No Delivered Orders Yet</h2>
            <p className="mt-3 text-[#6B3E2E]/60">Delivered orders will appear here.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-[35px] shadow-xl p-8">

                <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
                  <div>
                    <p className="text-sm text-[#6B3E2E]/50 mb-1">Order ID: {order._id}</p>
                    <p className="text-[#6B3E2E]/70 text-sm">Artisan: {order.artisan?.name || '—'}</p>
                    {order.shippingAddress && (
                      <p className="text-[#6B3E2E]/70 text-sm mt-1">Delivered to: {order.shippingAddress}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[#A44A32] font-bold text-xl">₹ {order.totalAmount}</p>
                    <p className="text-[#6B3E2E]/60 text-sm mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      <CheckCircle2 size={13} /> Delivered
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {(order.products || order.items)?.map((item) => {
                    const pid = item.product?._id;
                    const key = getKey(order._id, pid);
                    const rs  = reviewState[key] || {};
                    const productImg = (Array.isArray(item.product?.images) && item.product.images.length)
                      ? item.product.images[0]
                      : item.product?.image || '';

                    return (
                      <div key={key} className="bg-[#FFF9F3] rounded-2xl p-4">
                        <div className="flex items-center gap-4">
                          {productImg && (
                            <img src={productImg} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="font-semibold text-[#6B3E2E]">{item.product?.name}</p>
                            <p className="text-sm text-[#6B3E2E]/60">
                              Qty: {item.quantity} · ₹ {item.price || item.product?.price}
                            </p>
                          </div>
                          {pid && (
                            rs.submitted ? (
                              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                <CheckCircle2 size={14} /> Reviewed
                              </span>
                            ) : (
                              <button
                                onClick={() => toggleReview(order._id, pid)}
                                className="text-sm text-[#C96A4A] font-semibold border border-[#C96A4A] px-4 py-2 rounded-full hover:bg-[#FFF3EE] transition-all"
                              >
                                {rs.open ? 'Cancel' : 'Write Review'}
                              </button>
                            )
                          )}
                        </div>

                        {rs.open && !rs.submitted && (
                          <div className="mt-4 border-t border-[#E5D4C8] pt-4 space-y-3">
                            <StarPicker
                              value={rs.rating || 5}
                              onChange={(v) => setReviewState((prev) => ({
                                ...prev, [key]: { ...prev[key], rating: v }
                              }))}
                            />
                            <textarea
                              rows={3}
                              value={rs.text || ''}
                              onChange={(e) => setReviewState((prev) => ({
                                ...prev, [key]: { ...prev[key], text: e.target.value }
                              }))}
                              placeholder="Share your experience with this product..."
                              className="w-full border border-[#E5D4C8] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C96A4A]"
                            />
                            <button
                              onClick={() => submitReview(order._id, pid)}
                              disabled={rs.submitting}
                              className="bg-[#C96A4A] hover:bg-[#A44A32] text-white px-6 py-2 rounded-full text-sm font-semibold disabled:opacity-60 transition-all"
                            >
                              {rs.submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default PreviousOrders;
