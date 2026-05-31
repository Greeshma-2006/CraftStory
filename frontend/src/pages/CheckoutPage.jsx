// CheckoutPage is no longer used.
// Checkout is handled entirely by CheckoutModal (opened from CartPage and ProductDetailPage).
// This file redirects to the cart to avoid broken routes.
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate('/cart', { replace: true }); }, []);
  return null;
};

export default CheckoutPage;
