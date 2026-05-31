import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';

const ProductCard = ({
  product,
  onWishlist,
  onAddToCart,
}) => {

  return (

    <div className="bg-white rounded-[30px] overflow-hidden shadow-xl hover:-translate-y-2 transition-all duration-300">

      <div className="relative">

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-72 object-cover"
        />

        <button
          onClick={() => onWishlist(product)}
          className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg"
        >
          <Heart size={20} />
        </button>

      </div>

      <div className="p-6">

        <span className="inline-block bg-[#F5E6D3] text-[#6B3E2E] px-4 py-2 rounded-full text-sm mb-4">

          {product.category}

        </span>

        <h3 className="text-2xl font-bold text-[#6B3E2E]">

          {product.name}

        </h3>

        <p className="mt-4 text-[#6B3E2E]/70 line-clamp-3">

          {product.description}

        </p>

        <div className="flex items-center justify-between mt-6">

          <h4 className="text-2xl font-bold text-[#A44A32]">

            ₹ {product.price}

          </h4>

          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#C96A4A] hover:bg-[#A44A32] text-white transition-all"
          >

            <ShoppingCart size={18} />

            Add

          </button>

        </div>

      </div>

    </div>
  );
};

export default ProductCard;