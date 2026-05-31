import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowLeft, Package, User, Star, ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { productService, wishlistService, reviewService } from '../services';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewList from '../components/reviews/ReviewList';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const StarRating = ({ value, size = 16 }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map((s) => (
      <Star key={s} size={size} className={s <= Math.round(value) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-100'} />
    ))}
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, isCustomer } = useAuth();

  const [product,   setProduct]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [quantity,  setQuantity]  = useState(1);
  const [addingCart,setAddingCart]= useState(false);

  // Image gallery
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox,  setLightbox]  = useState(false);

  // Reviews
  const [reviews,            setReviews]            = useState([]);
  const [averageRating,      setAverageRating]      = useState(0);
  const [totalReviews,       setTotalReviews]       = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({1:0,2:0,3:0,4:0,5:0});

  useEffect(() => { fetchProduct(); fetchReviews(); }, [id]);

  const fetchProduct = async () => {
    try {
      const r = await productService.getOne(id);
      setProduct(r.data.data);
    } catch {
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const r = await reviewService.getReviews(id);
      setReviews(r.data.data || []);
      setAverageRating(r.data.averageRating || 0);
      setTotalReviews(r.data.totalReviews || 0);
      setRatingDistribution(r.data.ratingDistribution || {1:0,2:0,3:0,4:0,5:0});
    } catch {}
  };

  const submitReview = async (data) => {
    try {
      await reviewService.addReview(id, data);
      toast.success('Review submitted successfully');
      fetchReviews();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated || !isCustomer) {
      toast.error('Please login as customer');
      navigate('/login');
      return;
    }
    try {
      setAddingCart(true);
      await addToCart(product._id, quantity);
      toast.success('Added to cart');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated || !isCustomer) { toast.error('Please login first'); return; }
    try {
      await wishlistService.add({ productId: product._id, product: product._id });
      toast.success('Added to wishlist');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Wishlist update failed');
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated || !isCustomer) {
      toast.error('Please login as customer');
      navigate('/login');
      return;
    }
    try {
      setAddingCart(true);
      await addToCart(product._id, quantity);
    } catch (e) {
      // item may already be in cart — proceed to cart anyway
      console.error('Buy now add-to-cart error:', e);
    } finally {
      setAddingCart(false);
    }
    navigate('/cart');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9F3]">
      <div className="w-16 h-16 border-4 border-[#C96A4A] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return null;

  // Support single image string OR array
  const images = Array.isArray(product.images) && product.images.length
    ? product.images
    : product.image ? [product.image] : [];

  const currentImage = images[activeImg] || '';

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-16">
      <div className="max-w-7xl mx-auto px-6">

        <Link to="/products" className="inline-flex items-center gap-2 text-[#6B3E2E] hover:text-[#A44A32] mb-10 font-medium">
          <ArrowLeft size={18} /> Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* IMAGE SECTION */}
          <div className="space-y-4">

            {/* Main image - square with rounded edges */}
            <div
              className="relative w-full aspect-square rounded-[28px] overflow-hidden bg-[#F5EDE6] shadow-xl cursor-zoom-in group"
              onClick={() => images.length > 0 && setLightbox(true)}
            >
              {currentImage ? (
                <img src={currentImage} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#6B3E2E]/30 text-lg">No Image</div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white/80 rounded-full p-3">
                  <ZoomIn size={22} className="text-[#6B3E2E]" />
                </div>
              </div>
            </div>

            {/* Thumbnail strip - square rounded */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                      activeImg === i ? 'border-[#C96A4A] shadow-md scale-105' : 'border-[#E5D4C8] hover:border-[#C96A4A]/50'
                    }`}
                  >
                    <img src={url} alt={`View ${i+1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT INFO */}
          <div className="bg-white rounded-[28px] shadow-xl p-8">

            <span className="bg-[#F5E6D3] text-[#6B3E2E] px-4 py-1.5 rounded-full text-sm font-medium">
              {product.category}
            </span>

            <h1 className="text-4xl font-bold text-[#6B3E2E] mt-5">{product.name}</h1>

            <div className="flex items-center gap-3 mt-3">
              <StarRating value={averageRating} />
              <span className="text-sm text-[#6B3E2E]/60">
                {averageRating.toFixed(1)} ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            <p className="text-4xl font-bold text-[#A44A32] mt-5">₹{product.price?.toLocaleString()}</p>

            <div className="flex items-center gap-2 mt-4 text-[#6B3E2E]/70 text-sm">
              <Package size={16} />
              <span>{product.stock > 0 ? `${product.stock} in stock` : <span className="text-red-500 font-semibold">Out of Stock</span>}</span>
            </div>

            <div className="flex items-center gap-2 mt-2 text-[#6B3E2E]/70 text-sm">
              <User size={16} />
              <span>By {product.artisan?.name || 'CraftStory Artisan'}</span>
            </div>

            <div className="mt-6 pt-6 border-t border-[#F0E4DA]">
              <h2 className="text-lg font-bold text-[#6B3E2E] mb-2">Description</h2>
              <p className="text-[#6B3E2E]/80 leading-relaxed text-sm">{product.description}</p>
            </div>

            {/* QUANTITY */}
            <div className="mt-6">
              <label className="block text-[#6B3E2E] font-semibold mb-2 text-sm">Quantity</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-9 h-9 rounded-full bg-[#F5E6D3] text-[#6B3E2E] font-bold hover:bg-[#E7D5C7] transition">−</button>
                <span className="text-xl font-bold text-[#6B3E2E] w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q+1))} className="w-9 h-9 rounded-full bg-[#F5E6D3] text-[#6B3E2E] font-bold hover:bg-[#E7D5C7] transition">+</button>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="grid grid-cols-3 gap-3 mt-8">
              <button onClick={handleAddToCart} disabled={addingCart || product.stock === 0} className="flex items-center justify-center gap-2 bg-[#C96A4A] hover:bg-[#A44A32] text-white py-3 rounded-full transition-all text-sm font-semibold disabled:opacity-50">
                <ShoppingCart size={16} /> Cart
              </button>
              <button onClick={handleWishlist} className="flex items-center justify-center gap-2 border border-[#C96A4A] text-[#C96A4A] hover:bg-[#FFF3EE] py-3 rounded-full transition-all text-sm font-semibold">
                <Heart size={16} /> Wishlist
              </button>
              <button onClick={handleBuyNow} disabled={product.stock === 0} className="bg-[#6B3E2E] hover:bg-[#4F2C20] text-white py-3 rounded-full transition-all text-sm font-semibold disabled:opacity-50">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div className="grid lg:grid-cols-2 gap-10 mt-14">
          <ReviewList reviews={reviews} averageRating={averageRating} totalReviews={totalReviews} ratingDistribution={ratingDistribution} />
          {isAuthenticated && isCustomer && <ReviewForm onSubmit={submitReview} />}
        </div>

      </div>

      {/* LIGHTBOX */}
      {lightbox && images.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6" onClick={() => setLightbox(false)}>
          <button className="absolute top-5 right-5 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white" onClick={() => setLightbox(false)}>
            <X size={20} />
          </button>

          {images.length > 1 && (
            <>
              <button
                className="absolute left-5 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white"
                onClick={(e) => { e.stopPropagation(); setActiveImg(i => (i - 1 + images.length) % images.length); }}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                className="absolute right-16 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white"
                onClick={(e) => { e.stopPropagation(); setActiveImg(i => (i + 1) % images.length); }}
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <img
            src={images[activeImg]}
            alt="Zoomed"
            className="max-w-4xl max-h-[85vh] object-contain rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <div className="absolute bottom-6 flex gap-2">
              {images.map((_, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); setActiveImg(i); }}
                  className={`w-2 h-2 rounded-full transition ${i === activeImg ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
