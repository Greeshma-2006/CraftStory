import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService, paymentService } from '../../services';
import { X, CreditCard, Truck, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const CheckoutModal = ({ onClose, onSuccess }) => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [step,          setStep]          = useState('address');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [result,        setResult]        = useState(null); // 'success' | 'failed'
  const [loading,       setLoading]       = useState(false);

  const [address, setAddress] = useState({
    street:      '',
    city:        '',
    state:       '',
    pincode:     '',
    phoneNumber: user?.phone || '',
  });

  const shipping = (cartTotal || 0) >= 999 ? 0 : 99;
  const total    = (cartTotal || 0) + shipping;

  // Build a single address string for backend
  const addressString = () =>
    `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`;

  // Validate address step
  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.state || !address.pincode) {
      toast.error('Please fill all address fields');
      return;
    }
    if (!/^\d{10}$/.test(address.phoneNumber)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    setStep('payment');
  };

  // Build the order payload and POST to backend
  const placeOrder = async (paymentId = null) => {
    const products = (cart?.items || []).map((i) => ({
      product:  i.product._id,
      quantity: i.quantity,
    }));

    if (products.length === 0) {
      throw new Error('Your cart is empty');
    }

    const res = await orderService.create({
      products,
      shippingAddress: addressString(),
      phoneNumber:     address.phoneNumber,
      paymentMethod,
      orderNotes:      '',
      ...(paymentId ? { paymentId } : {}),
    });

    return res;
  };

  // Main order handler
  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      if (paymentMethod === 'cod') {
        // ── COD ─────────────────────────────────────────────────────────────
        await placeOrder();
        await clearCart();
        setResult('success');
        setStep('result');
        onSuccess?.();

      } else {
        // ── RAZORPAY ─────────────────────────────────────────────────────────
        // 1. Get key
        const keyRes = await paymentService.getRazorpayKey();
        const razorpayKey = keyRes.data.key;

        if (!razorpayKey) {
          throw new Error('Razorpay key not configured on server');
        }

        // 2. Create Razorpay order on backend
        //    Backend returns: { success, order: { id, amount, currency }, key }
        const rpRes   = await paymentService.createRazorpayOrder({ amount: total });
        const rpOrder = rpRes.data.order;            // ← matches paymentController response

        if (!rpOrder?.id) {
          throw new Error('Failed to create payment order');
        }

        // 3. Open Razorpay checkout widget
        const options = {
          key:         razorpayKey,
          amount:      rpOrder.amount,               // already in paise from backend
          currency:    rpOrder.currency || 'INR',
          name:        'CraftStory',
          description: 'Handcrafted Goods',
          order_id:    rpOrder.id,                   // Razorpay order id
          handler: async (response) => {
            try {
              // 4. Verify signature on backend
              await paymentService.verifyPayment({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
              });

              // 5. Create order in our DB with paymentId
              await placeOrder(response.razorpay_payment_id);
              await clearCart();
              setResult('success');
              setStep('result');
              onSuccess?.();
            } catch (err) {
              toast.error(err.response?.data?.message || 'Payment verification failed');
              setResult('failed');
              setStep('result');
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name:    user?.name    || '',
            email:   user?.email   || '',
            contact: address.phoneNumber,
          },
          theme:  { color: '#C96A4A' },
          modal:  { ondismiss: () => setLoading(false) },
        };

        if (!window.Razorpay) {
          throw new Error('Razorpay SDK not loaded. Please refresh the page.');
        }

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response) => {
          if (response.error?.reason !== 'payment_cancelled') {
            setResult('failed');
            setStep('result'); 
          }
          setLoading(false);
        });
        rzp.open();
        return; // loading will be cleared in handler callbacks
      }

    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(err.response?.data?.message || err.message || 'Order failed. Please try again.');
      setResult('failed');
      setStep('result');
    } finally {
      if (paymentMethod === 'cod') setLoading(false);
    }
  };

  const handleViewOrders = () => {
    onClose();
    navigate('/customer/orders');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto">

        {/* HEADER */}
        <div className="p-6 border-b border-[#F0E4DA] flex justify-between items-center sticky top-0 bg-white rounded-t-3xl z-10">
          <h2 className="text-2xl font-bold text-[#6B3E2E]">
            {step === 'address' && '📦 Delivery Details'}
            {step === 'payment' && '💳 Payment'}
            {step === 'result'  && (result === 'success' ? '✅ Order Placed' : '❌ Order Failed')}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F5E6D3] hover:bg-[#E7D5C7] flex items-center justify-center transition"
          >
            <X size={18} className="text-[#6B3E2E]" />
          </button>
        </div>

        <div className="p-6">

          {/* ── STEP 1: ADDRESS ───────────────────────────────────────────── */}
          {step === 'address' && (
            <form onSubmit={handleAddressSubmit} className="space-y-4">

              <div>
                <label className="block text-sm font-semibold text-[#6B3E2E] mb-1">Street / House No.</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="123, MG Road, Apartment 4B"
                  className="w-full border border-[#E5D4C8] rounded-xl px-4 py-3 outline-none focus:border-[#C96A4A] focus:ring-2 focus:ring-[#C96A4A]/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-[#6B3E2E] mb-1">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="Hyderabad"
                    className="w-full border border-[#E5D4C8] rounded-xl px-4 py-3 outline-none focus:border-[#C96A4A] focus:ring-2 focus:ring-[#C96A4A]/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#6B3E2E] mb-1">State</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder="Telangana"
                    className="w-full border border-[#E5D4C8] rounded-xl px-4 py-3 outline-none focus:border-[#C96A4A] focus:ring-2 focus:ring-[#C96A4A]/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-[#6B3E2E] mb-1">Pincode</label>
                  <input
                    type="text"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g,'').slice(0,6) })}
                    placeholder="500001"
                    className="w-full border border-[#E5D4C8] rounded-xl px-4 py-3 outline-none focus:border-[#C96A4A] focus:ring-2 focus:ring-[#C96A4A]/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#6B3E2E] mb-1">Phone</label>
                  <input
                    type="tel"
                    value={address.phoneNumber}
                    onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value.replace(/\D/g,'').slice(0,10) })}
                    placeholder="9876543210"
                    className="w-full border border-[#E5D4C8] rounded-xl px-4 py-3 outline-none focus:border-[#C96A4A] focus:ring-2 focus:ring-[#C96A4A]/20"
                    required
                  />
                </div>
              </div>

              {/* Order summary */}
              <div className="bg-[#FFF9F3] rounded-2xl p-4 space-y-2 text-sm text-[#6B3E2E]">
                {(cart?.items || []).map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="line-clamp-1 flex-1">{item.product?.name} × {item.quantity}</span>
                    <span className="ml-2">₹{(item.product?.price || 0) * item.quantity}</span>
                  </div>
                ))}
                <hr className="border-[#E5D4C8]" />
                <div className="flex justify-between"><span>Subtotal</span><span>₹{cartTotal}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? '🎉 Free' : `₹${shipping}`}</span></div>
                <div className="flex justify-between font-bold text-base border-t border-[#E5D4C8] pt-2">
                  <span>Total</span><span>₹{total}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-[#C96A4A] hover:bg-[#A44A32] text-white font-semibold transition-all"
              >
                Continue to Payment →
              </button>
            </form>
          )}

          {/* ── STEP 2: PAYMENT ───────────────────────────────────────────── */}
          {step === 'payment' && (
            <div className="space-y-5">

              <p className="text-sm text-[#6B3E2E]/70">
                Delivering to: <span className="font-semibold text-[#6B3E2E]">{addressString()}</span>
                <button onClick={() => setStep('address')} className="ml-2 text-[#C96A4A] underline text-xs">Change</button>
              </p>

              {/* Payment options */}
              {[
                { id: 'cod',      icon: Truck,       label: 'Cash on Delivery',      desc: 'Pay when your order arrives' },
                { id: 'razorpay', icon: CreditCard,   label: 'Pay Online (Razorpay)', desc: 'UPI, Cards, Net Banking' },
              ].map(({ id, icon: Icon, label, desc }) => (
                <label
                  key={id}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === id
                      ? 'border-[#C96A4A] bg-[#FFF3EE]'
                      : 'border-[#E5D4C8] hover:border-[#C96A4A]/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={id}
                    checked={paymentMethod === id}
                    onChange={() => setPaymentMethod(id)}
                    className="accent-[#C96A4A]"
                  />
                  <Icon size={22} className="text-[#C96A4A] shrink-0" />
                  <div>
                    <p className="font-semibold text-[#6B3E2E]">{label}</p>
                    <p className="text-xs text-[#6B3E2E]/60">{desc}</p>
                  </div>
                  {paymentMethod === id && (
                    <div className="ml-auto w-3 h-3 bg-[#C96A4A] rounded-full" />
                  )}
                </label>
              ))}

              <div className="bg-[#FFF9F3] rounded-2xl p-4 flex justify-between font-bold text-[#6B3E2E]">
                <span>Order Total</span>
                <span>₹{total}</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('address')}
                  className="flex-1 py-3 rounded-full border border-[#C96A4A] text-[#C96A4A] hover:bg-[#FFF3EE] transition-all font-semibold"
                >
                  ← Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex-1 py-3 rounded-full bg-[#C96A4A] hover:bg-[#A44A32] text-white font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `${paymentMethod === 'cod' ? '📦 Place Order' : '💳 Pay'} · ₹${total}`
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: RESULT ────────────────────────────────────────────── */}
          {step === 'result' && (
            <div className="text-center py-6">
              {result === 'success' ? (
                <>
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-5" />
                  <h3 className="text-2xl font-bold text-[#6B3E2E] mb-2">Order Placed Successfully!</h3>
                  <p className="text-[#6B3E2E]/70 mb-2">
                    {paymentMethod === 'cod'
                      ? 'Your order is confirmed. Pay on delivery.'
                      : 'Payment successful! Your order is confirmed.'}
                  </p>
                  <p className="text-sm text-[#6B3E2E]/50 mb-8">
                    The artisan will prepare and ship your handcrafted item.
                  </p>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleViewOrders}
                      className="w-full py-3 rounded-full bg-[#C96A4A] hover:bg-[#A44A32] text-white font-semibold transition-all"
                    >
                      Track My Order
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full py-3 rounded-full border border-[#E5D4C8] text-[#6B3E2E] hover:bg-[#F5E6D3] font-semibold transition-all"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-20 h-20 text-red-400 mx-auto mb-5" />
                  <h3 className="text-2xl font-bold text-[#6B3E2E] mb-2">Order Failed</h3>
                  <p className="text-[#6B3E2E]/70 mb-8">
                    Something went wrong. Your cart is unchanged — please try again.
                  </p>
                  <button
                    onClick={() => setStep('payment')}
                    className="w-full py-3 rounded-full bg-[#C96A4A] hover:bg-[#A44A32] text-white font-semibold transition-all"
                  >
                    Try Again
                  </button>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
