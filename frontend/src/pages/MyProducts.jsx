import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { productService, uploadService, reviewService } from '../services';
import { ArrowLeft, Star, Edit, Trash2 } from 'lucide-react';

const CATEGORIES = ['Pottery','Textiles','Jewelry','Woodwork','Metalwork','Paintings','Baskets','Other'];
const initialForm = { image: '', name: '', description: '', price: '', category: '', stock: '' };

// ── Star display ──────────────────────────────────────────────────────────────
const StarDisplay = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map((s) => (
      <Star key={s} size={14} className={s <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
    ))}
  </div>
);

const MyProducts = () => {
  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [submitting,  setSubmitting]  = useState(false);
  const [editingId,   setEditingId]   = useState(null);
  const [formData,    setFormData]    = useState(initialForm);
  const [uploading,   setUploading]   = useState(false);

  // Detail view state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews,         setReviews]         = useState([]);
  const [reviewsLoading,  setReviewsLoading]  = useState(false);
  const [reviewStats,     setReviewStats]     = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const r = await productService.getArtisanProducts();
      setProducts(r.data.data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const openProductDetail = async (product) => {
    setSelectedProduct(product);
    setReviewsLoading(true);
    try {
      const r = await reviewService.getReviews(product._id);
      setReviews(r.data.data || []);
      setReviewStats({
        total:   r.data.totalReviews,
        average: r.data.averageRating,
        dist:    r.data.ratingDistribution,
      });
    } catch {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const resetForm = () => { setEditingId(null); setFormData(initialForm); };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await uploadService.uploadImage(fd);
      setFormData((f) => ({ ...f, image: r.data.url }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image || !formData.name || !formData.description || !formData.price || !formData.category || !formData.stock) {
      toast.error('Please fill all fields and upload an image'); return;
    }
    try {
      setSubmitting(true);
      if (editingId) {
        await productService.update(editingId, formData);
        toast.success('Product updated successfully');
      } else {
        await productService.create(formData);
        toast.success('Product created successfully');
      }
      resetForm();
      fetchProducts();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(null);
    setEditingId(product._id);
    setFormData({ image: product.image, name: product.name, description: product.description, price: product.price, category: product.category, stock: product.stock });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productService.delete(id);
      toast.success('Product deleted');
      if (selectedProduct?._id === id) setSelectedProduct(null);
      fetchProducts();
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9F3]">
      <div className="w-16 h-16 border-4 border-[#C96A4A] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // ── PRODUCT DETAIL VIEW ────────────────────────────────────────────────────
  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] py-16">
        <div className="max-w-5xl mx-auto px-6">

          <button onClick={() => setSelectedProduct(null)}
            className="flex items-center gap-2 text-[#6B3E2E] hover:text-[#A44A32] mb-8 font-medium">
            <ArrowLeft size={18} /> Back to My Products
          </button>

          {/* Product card */}
          <div className="bg-white rounded-[35px] shadow-xl overflow-hidden mb-10">
            <div className="grid md:grid-cols-2 gap-0">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-80 md:h-full object-cover"
              />
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold bg-[#F5E6D3] text-[#A44A32] px-3 py-1 rounded-full">
                    {selectedProduct.category}
                  </span>
                  <h1 className="text-4xl font-bold text-[#6B3E2E] mt-4 mb-2">{selectedProduct.name}</h1>
                  <p className="text-3xl font-bold text-[#C96A4A] mb-4">₹ {selectedProduct.price}</p>
                  <p className="text-[#6B3E2E]/80 leading-relaxed mb-4">{selectedProduct.description}</p>
                  <p className="text-sm text-[#6B3E2E]/60">Stock: {selectedProduct.stock} units</p>

                  {reviewStats && reviewStats.total > 0 && (
                    <div className="flex items-center gap-2 mt-4">
                      <StarDisplay rating={Math.round(reviewStats.average)} />
                      <span className="text-sm font-semibold text-[#6B3E2E]">
                        {reviewStats.average} / 5
                      </span>
                      <span className="text-sm text-[#6B3E2E]/60">
                        ({reviewStats.total} review{reviewStats.total !== 1 ? 's' : ''})
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => handleEdit(selectedProduct)}
                    className="flex items-center gap-2 px-5 py-3 bg-[#C96A4A] text-white rounded-full font-semibold hover:bg-[#A44A32] transition">
                    <Edit size={15} /> Edit
                  </button>
                  <button onClick={() => handleDelete(selectedProduct._id)}
                    className="flex items-center gap-2 px-5 py-3 bg-red-50 text-red-600 rounded-full font-semibold hover:bg-red-100 transition border border-red-200">
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews section */}
          <div className="bg-white rounded-[35px] shadow-xl p-8">
            <h2 className="text-3xl font-bold text-[#6B3E2E] mb-6">
              Customer Reviews & Ratings
            </h2>

            {reviewsLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-10 h-10 border-4 border-[#C96A4A] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-10 text-[#6B3E2E]/50">
                <Star size={48} className="mx-auto mb-3 opacity-30" />
                <p className="text-lg">No reviews yet for this product.</p>
              </div>
            ) : (
              <>
                {/* Rating summary */}
                {reviewStats && (
                  <div className="bg-[#FFF9F3] rounded-2xl p-5 mb-6 flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-5xl font-bold text-[#C96A4A]">{reviewStats.average}</p>
                      <StarDisplay rating={Math.round(reviewStats.average)} />
                      <p className="text-sm text-[#6B3E2E]/60 mt-1">{reviewStats.total} reviews</p>
                    </div>
                    <div className="flex-1 space-y-1">
                      {[5,4,3,2,1].map((star) => (
                        <div key={star} className="flex items-center gap-2 text-sm">
                          <span className="w-4 text-[#6B3E2E]/60">{star}</span>
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-amber-400 h-2 rounded-full transition-all"
                              style={{ width: `${reviewStats.total ? (reviewStats.dist[star] / reviewStats.total) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="w-4 text-[#6B3E2E]/60">{reviewStats.dist[star]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Individual reviews */}
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="bg-[#FFF9F3] rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#C96A4A] flex items-center justify-center text-white text-sm font-bold">
                            {(review.user?.name || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-[#6B3E2E] text-sm">{review.user?.name || 'Customer'}</p>
                            <StarDisplay rating={review.rating} />
                          </div>
                        </div>
                        <p className="text-xs text-[#6B3E2E]/50">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </p>
                      </div>
                      <p className="text-[#6B3E2E]/80 text-sm leading-relaxed">{review.review}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    );
  }

  // ── MAIN LIST VIEW ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FFF9F3] py-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-12">
          <h1 className="text-5xl font-bold text-[#6B3E2E] mb-4">My Products</h1>
          <p className="text-[#6B3E2E]/70">Click any product to see its details and customer reviews.</p>
        </div>

        {/* ADD / EDIT FORM */}
        <div className="bg-white rounded-[30px] shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-[#6B3E2E] mb-6">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#6B3E2E] mb-2">Product Image</label>
              <div className="flex items-center gap-5">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#F5EDE6] border border-[#E5D4C8] flex-shrink-0 flex items-center justify-center">
                  {formData.image
                    ? <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    : <span className="text-[#6B3E2E]/30 text-xs text-center px-2">No image</span>
                  }
                </div>
                <label className={`cursor-pointer px-5 py-3 rounded-full border-2 border-dashed border-[#C96A4A] text-[#C96A4A] font-semibold text-sm hover:bg-[#FFF3EE] transition ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
                  {uploading ? 'Uploading...' : 'Choose Image'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>
            <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange}
              className="w-full border border-[#E5D4C8] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#C96A4A]" />
            <textarea rows="4" name="description" placeholder="Product Description" value={formData.description} onChange={handleChange}
              className="w-full border border-[#E5D4C8] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#C96A4A]" />
            <div className="grid md:grid-cols-3 gap-5">
              <input type="number" name="price" placeholder="Price (₹)" value={formData.price} onChange={handleChange}
                className="border border-[#E5D4C8] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#C96A4A]" />
              <select name="category" value={formData.category} onChange={handleChange}
                className="border border-[#E5D4C8] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#C96A4A] bg-white">
                <option value="">Select Category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="number" name="stock" placeholder="Stock Qty" value={formData.stock} onChange={handleChange}
                className="border border-[#E5D4C8] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#C96A4A]" />
            </div>
            <div className="flex gap-4">
              <button type="submit" disabled={submitting}
                className="px-8 py-4 rounded-full bg-[#C96A4A] hover:bg-[#A44A32] text-white font-semibold transition disabled:opacity-60">
                {submitting ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm}
                  className="px-8 py-4 rounded-full bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* PRODUCT GRID */}
        {products.length === 0 ? (
          <div className="bg-white rounded-[35px] shadow-xl p-10 text-center">
            <h2 className="text-3xl font-bold text-[#6B3E2E]">No Products Yet</h2>
            <p className="mt-4 text-[#6B3E2E]/70">Start sharing your handmade creations.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-[24px] overflow-hidden shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                onClick={() => openProductDetail(product)}
              >
                <div className="w-full aspect-square overflow-hidden bg-[#F5EDE6]">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold bg-[#F5E6D3] text-[#A44A32] px-3 py-1 rounded-full">{product.category}</span>
                    <span className="text-[#A44A32] font-bold text-sm">₹{product.price}</span>
                  </div>
                  <h2 className="text-base font-bold text-[#6B3E2E] line-clamp-1">{product.name}</h2>
                  <p className="text-xs text-[#6B3E2E]/60 mt-1 line-clamp-2">{product.description}</p>
                  <p className="text-xs text-[#6B3E2E]/50 mt-2">Stock: {product.stock}</p>
                  <p className="text-xs text-[#C96A4A] mt-2 font-medium">Click to view details & reviews →</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyProducts;
