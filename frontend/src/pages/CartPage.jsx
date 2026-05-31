import React, { useState } from 'react';

import {
  Link,
} from 'react-router-dom';

import { useCart } from '../context/CartContext';

import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowLeft,
} from 'lucide-react';

import { toast } from 'sonner';

import CheckoutModal from '../components/payment/CheckoutModal';

const CartPage = () => {

  const {
    cart,
    cartTotal,
    updateCartItem,
    removeFromCart,
    clearCart,
    loading,
  } = useCart();

  const [showCheckout,
    setShowCheckout] =
    useState(false);

  const handleQuantityChange =
    async (
      productId,
      newQty
    ) => {

      try {

        await updateCartItem(
          productId,
          newQty
        );

      } catch {

        toast.error(
          'Failed to update quantity'
        );
      }
    };

  const handleRemove =
    async (
      productId
    ) => {

      try {

        await removeFromCart(
          productId
        );

        toast.success(
          'Item removed'
        );

      } catch {

        toast.error(
          'Failed to remove item'
        );
      }
    };

  const handleClearCart =
    async () => {

      try {

        await clearCart();

        toast.success(
          'Cart cleared'
        );

      } catch {

        toast.error(
          'Failed to clear cart'
        );
      }
    };

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F3]">

        <div className="w-16 h-16 border-4 border-[#C96A4A] border-t-transparent rounded-full animate-spin"></div>

      </div>
    );
  }

  const items =
    cart?.items || [];

  if (
    items.length === 0
  ) {

    return (

      <div className="min-h-screen bg-[#FFF9F3] flex flex-col items-center justify-center py-20">

        <ShoppingBag
          className="w-20 h-20 text-[#C96A4A] mb-6"
        />

        <h2 className="text-4xl font-bold text-[#6B3E2E] mb-4">

          Your Cart Is Empty

        </h2>

        <p className="text-[#6B3E2E]/70 mb-8">

          Discover handcrafted treasures from artisans.

        </p>

        <Link
          to="/products"
          className="bg-[#C96A4A] hover:bg-[#A44A32] text-white px-8 py-4 rounded-full transition-all"
        >

          Browse Products

        </Link>

      </div>
    );
  }

  const shipping =
    cartTotal >= 999
      ? 0
      : 99;

  const total =
    cartTotal + shipping;

  return (

    <div className="min-h-screen bg-[#FFF9F3] py-16">

      <div className="max-w-7xl mx-auto px-6">

        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-[#6B3E2E] hover:text-[#A44A32] mb-10"
        >

          <ArrowLeft size={18} />

          Continue Shopping

        </Link>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* CART ITEMS */}

          <div className="lg:col-span-2 space-y-6">

            {items.map(
              (item) => (

                <div
                  key={
                    item.product._id
                  }
                  className="bg-white rounded-[30px] shadow-xl p-6 flex flex-col md:flex-row gap-6"
                >

                  <img
                    src={
                      (Array.isArray(item.product.images) && item.product.images.length)
                        ? item.product.images[0]
                        : item.product.image || ''
                    }
                    alt=""
                    className="w-full md:w-40 h-40 object-cover rounded-[20px]"
                  />

                  <div className="flex-1">

                    <h2 className="text-2xl font-bold text-[#6B3E2E]">

                      {
                        item.product.name
                      }

                    </h2>

                    <p className="text-[#A44A32] mt-2">

                      ₹
                      {' '}
                      {
                        item.product.price
                      }

                    </p>

                    <p className="text-sm text-[#6B3E2E]/70 mt-2">

                      {
                        item.product.category
                      }

                    </p>

                    {/* QUANTITY */}

                    <div className="flex items-center gap-3 mt-6">

                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product._id,
                            item.quantity -
                              1
                          )
                        }
                        className="w-10 h-10 rounded-full bg-[#F5E6D3] flex items-center justify-center"
                      >

                        <Minus
                          size={16}
                        />

                      </button>

                      <span className="font-bold text-[#6B3E2E]">

                        {
                          item.quantity
                        }

                      </span>

                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product._id,
                            item.quantity +
                              1
                          )
                        }
                        className="w-10 h-10 rounded-full bg-[#F5E6D3] flex items-center justify-center"
                      >

                        <Plus
                          size={16}
                        />

                      </button>

                    </div>

                  </div>

                  <div className="flex flex-col justify-between">

                    <button
                      onClick={() =>
                        handleRemove(
                          item.product._id
                        )
                      }
                      className="text-red-500 hover:text-red-700"
                    >

                      <Trash2
                        size={20}
                      />

                    </button>

                    <p className="text-xl font-bold text-[#6B3E2E]">

                      ₹
                      {' '}
                      {
                        item.product.price *
                        item.quantity
                      }

                    </p>

                  </div>

                </div>
              )
            )}

          </div>

          {/* SUMMARY */}

          <div>

            <div className="bg-white rounded-[30px] shadow-xl p-8 sticky top-24">

              <h2 className="text-3xl font-bold text-[#6B3E2E] mb-8">

                Order Summary

              </h2>

              <div className="space-y-4">

                <div className="flex justify-between">

                  <span>

                    Subtotal

                  </span>

                  <span>

                    ₹ {cartTotal}

                  </span>

                </div>

                <div className="flex justify-between">

                  <span>

                    Shipping

                  </span>

                  <span>

                    {shipping === 0
                      ? 'Free'
                      : `₹ ${shipping}`}

                  </span>

                </div>

                <hr />

                <div className="flex justify-between text-xl font-bold text-[#6B3E2E]">

                  <span>

                    Total

                  </span>

                  <span>

                    ₹ {total}

                  </span>

                </div>

              </div>

              <button
                onClick={() =>
                  setShowCheckout(
                    true
                  )
                }
                className="w-full mt-8 py-4 rounded-full bg-[#C96A4A] hover:bg-[#A44A32] text-white transition-all"
              >

                Proceed To Checkout

              </button>

              <button
                onClick={
                  handleClearCart
                }
                className="w-full mt-4 py-4 rounded-full border border-red-500 text-red-500 hover:bg-red-50 transition-all"
              >

                Clear Cart

              </button>

            </div>

          </div>

        </div>

      </div>

      {showCheckout && (

        <CheckoutModal
          onClose={() =>
            setShowCheckout(
              false
            )
          }
        />

      )}

    </div>
  );
};

export default CartPage;