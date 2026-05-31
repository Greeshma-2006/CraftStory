import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Star } from 'lucide-react';
import { productService } from '../services';

const CATEGORIES = ['All','Pottery','Textiles','Jewelry','Woodwork','Metalwork','Paintings','Baskets','Other'];

const StarRating = ({ value }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map((s) => (
      <Star key={s} size={13} className={s <= Math.round(value) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-100'} />
    ))}
  </div>
);

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [totalPages, setTotalPages]     = useState(1);
  const [currentPage, setCurrentPage]   = useState(1);

  const category   = searchParams.get('category') || '';
  const search     = searchParams.get('search')   || '';
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => { fetchProducts(); }, [category, search, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: 12 };
      if (category && category !== 'All') params.category = category;
      if (search) params.search = search;
      const r = await productService.getAll(params);
      setProducts(r.data.data);
      setTotalPages(r.data.pages || 1);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleCategory = (cat) => {
    setCurrentPage(1);
    setSearchParams(cat === 'All' ? {} : { category: cat });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchParams(searchInput ? { search: searchInput } : {});
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9F3]">
      <div className="w-16 h-16 border-4 border-[#C96A4A] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-12">
          <h1 className="text-5xl font-bold text-[#6B3E2E] mb-4">Handcrafted Products</h1>
          <p className="text-[#6B3E2E]/70">Discover authentic handmade creations from skilled artisans.</p>
        </div>

        {/* SEARCH */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="flex-1 px-5 py-3 rounded-full border border-[#E5D4C8] focus:outline-none focus:ring-2 focus:ring-[#C96A4A] bg-white"
          />
          <button type="submit" className="px-6 py-3 rounded-full bg-[#C96A4A] text-white font-semibold hover:bg-[#A44A32] transition">
            Search
          </button>
        </form>

        {/* CATEGORIES */}
        <div className="flex flex-wrap gap-3 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`px-5 py-2 rounded-full transition-all text-sm font-medium ${
                category === cat || (!category && cat === 'All')
                  ? 'bg-[#C96A4A] text-white shadow-md'
                  : 'bg-white text-[#6B3E2E] border border-[#E5D4C8] hover:border-[#C96A4A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-[35px] shadow-xl p-14 text-center">
            <h2 className="text-4xl font-bold text-[#6B3E2E] mb-4">No Products Found</h2>
            <p className="text-[#6B3E2E]/70">Try another category or search term.</p>
          </div>
        ) : (
          <>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-6">
              {products.map((product) => (
                <Link
                  to={`/products/${product._id}`}
                  key={product._id}
                  className="bg-white rounded-[24px] overflow-hidden shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
                >
                  {/* SQUARE IMAGE */}
                  <div className="w-full aspect-square overflow-hidden bg-[#F5EDE6]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* INFO */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold bg-[#F5E6D3] text-[#A44A32] px-3 py-1 rounded-full">
                        {product.category}
                      </span>
                      <span className="text-[#A44A32] font-bold text-sm">₹{product.price}</span>
                    </div>

                    <h2 className="text-base font-bold text-[#6B3E2E] line-clamp-1 mb-1">
                      {product.name}
                    </h2>

                    {product.averageRating > 0 && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <StarRating value={product.averageRating} />
                        <span className="text-xs text-[#6B3E2E]/60">({product.totalReviews})</span>
                      </div>
                    )}

                    <p className="text-xs text-[#6B3E2E]/60 line-clamp-2">{product.description}</p>

                    <div className="mt-3 pt-3 border-t border-[#F0E4DA]">
                      <span className="text-xs text-[#6B3E2E]/50">Stock: {product.stock}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-14">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-full text-sm font-semibold transition ${
                      currentPage === i + 1
                        ? 'bg-[#C96A4A] text-white shadow-md'
                        : 'bg-white border border-[#E5D4C8] text-[#6B3E2E] hover:border-[#C96A4A]'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default ProductsPage;
