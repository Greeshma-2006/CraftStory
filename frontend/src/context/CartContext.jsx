import React, {
  createContext,
  useState,
  useContext,
  useEffect
} from 'react';

import { cartService } from '../services';

import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {

  const context = useContext(CartContext);

  if (!context) {

    throw new Error(
      'useCart must be used within CartProvider'
    );

  }

  return context;
};

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState({
    items: []
  });

  const [loading, setLoading] = useState(false);

  const { isAuthenticated, isCustomer } = useAuth();

  useEffect(() => {

    if (isAuthenticated && isCustomer) {

      fetchCart();

    } else {

      setCart({
        items: []
      });

    }

  }, [isAuthenticated, isCustomer]);

  const fetchCart = async () => {

    try {

      setLoading(true);

      const res = await cartService.get();

      setCart(
        res.data.data || {
          items: []
        }
      );

    } catch (e) {

      console.error('Cart fetch error:', e);

    } finally {

      setLoading(false);

    }
  };

  const addToCart = async (
    productId,
    quantity = 1
  ) => {

    const res = await cartService.add({
      productId,
      quantity
    });

    setCart(res.data.data);

    return res;
  };

  const updateCartItem = async (
    productId,
    quantity
  ) => {

    const res = await cartService.update({
      productId,
      quantity
    });

    setCart(res.data.data);

  };

  const removeFromCart = async (
    productId
  ) => {

    const res = await cartService.remove(
      productId
    );

    setCart(res.data.data);

  };

  const clearCart = async () => {

    const res = await cartService.clear();

    setCart(res.data.data);

  };

  const cartItemsCount =
    cart?.items?.reduce(
      (sum, item) => sum + item.quantity,
      0
    ) || 0;

  const cartTotal =
    cart?.items?.reduce(
      (sum, item) =>
        sum +
        (item.product?.price || 0) *
          item.quantity,
      0
    ) || 0;

  return (

    <CartContext.Provider
      value={{

        cart,
        loading,
        cartItemsCount,
        cartTotal,

        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,

      }}
    >

      {children}

    </CartContext.Provider>

  );
};