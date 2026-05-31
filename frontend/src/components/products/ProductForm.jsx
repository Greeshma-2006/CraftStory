import React, { useState } from 'react';

const ProductForm = ({
  onSubmit,
}) => {

  const [formData, setFormData] = useState({
    image: '',
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = (e) => {

    e.preventDefault();

    onSubmit(formData);

    setFormData({
      image: '',
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
    });
  };

  return (

    <form
      onSubmit={submitHandler}
      className="bg-white rounded-[35px] shadow-xl p-8 space-y-5"
    >

      <input
        type="text"
        name="image"
        placeholder="Product Image URL"
        value={formData.image}
        onChange={handleChange}
        className="w-full border border-[#E7D5C7] rounded-2xl px-4 py-3"
      />

      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full border border-[#E7D5C7] rounded-2xl px-4 py-3"
      />

      <textarea
        rows="5"
        name="description"
        placeholder="Product Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border border-[#E7D5C7] rounded-2xl px-4 py-3"
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        className="w-full border border-[#E7D5C7] rounded-2xl px-4 py-3"
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
        className="w-full border border-[#E7D5C7] rounded-2xl px-4 py-3"
      />

      <input
        type="number"
        name="stock"
        placeholder="Available Stock"
        value={formData.stock}
        onChange={handleChange}
        className="w-full border border-[#E7D5C7] rounded-2xl px-4 py-3"
      />

      <button
        type="submit"
        className="w-full bg-[#C96A4A] hover:bg-[#A44A32] text-white py-4 rounded-full font-semibold transition-all"
      >
        Save Product
      </button>

    </form>

  );
};

export default ProductForm;