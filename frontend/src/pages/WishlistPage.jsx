import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wishlistService } from '../services';
import { useCart } from '../context/CartContext';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

const WishlistPage = () => {
  const [products, setProducts] = useState([]);   // flat array of product objects
  const [loading,  setLoading]  = useState(true);
  const { addToCart } = useCart();

  useEffect(() => { fetchWishlist(); }, []);

  const fetchWishlist = async () => {
    try {
      const res = await wishlistService.get();
      // Backend returns { data: { products: [...populated product objects] } }
      setProducts(res.data.data?.products || []);
    } catch {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await wishlistService.remove(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      await wishlistService.remove(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      toast.success('Moved to cart');
    } catch {
      toast.error('Failed to move item');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#C96A4A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] flex flex-col items-center justify-center">
        <Heart size={80} className="text-[#C96A4A]" />
        <h2 className="text-4xl font-bold text-[#6B3E2E] mt-6">Wishlist Empty</h2>
        <p className="mt-4 text-[#6B3E2E]/70">Save your favorite handmade products.</p>
        <Link to="/products" className="mt-8 bg-[#C96A4A] hover:bg-[#A44A32] text-white px-8 py-4 rounded-full transition-all">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-16">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-center gap-4 mb-10">
          <Heart className="text-[#C96A4A]" />
          <h1 className="text-5xl font-bold text-[#6B3E2E]">My Wishlist</h1>
          <span className="bg-[#F5E6D3] text-[#C96A4A] px-3 py-1 rounded-full text-sm font-semibold">
            {products.length} item{products.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {products.map((product) => {
            const img = (Array.isArray(product.images) && product.images.length)
              ? product.images[0]
              : product.image || '';

            return (
              <div key={product._id} className="bg-white rounded-[35px] overflow-hidden shadow-xl">
                <Link to={`/products/${product._id}`}>
                  {img ? (
                    <img src={img} alt={product.name} className="h-64 w-full object-cover hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="h-64 w-full bg-[#F5EDE6] flex items-center justify-center text-[#6B3E2E]/30">No Image</div>
                  )}
                </Link>

                <div className="p-6">
                  <Link to={`/products/${product._id}`}>
                    <h2 className="text-xl font-bold text-[#6B3E2E] hover:text-[#C96A4A] transition-colors">{product.name}</h2>
                  </Link>
                  <p className="mt-2 text-[#A44A32] text-xl font-bold">₹ {product.price}</p>
                  {product.category && (
                    <p className="text-sm text-[#6B3E2E]/50 mt-1">{product.category}</p>
                  )}

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => handleMoveToCart(product._id)}
                      className="flex-1 bg-[#C96A4A] hover:bg-[#A44A32] text-white py-3 rounded-full flex items-center justify-center gap-2 transition-all"
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="bg-red-100 hover:bg-red-200 text-red-500 px-4 rounded-full transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default WishlistPage;
