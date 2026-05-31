const generateOrderNumber = () => {
  return `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
};

const calculateCartTotal = (items) => {
  return items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
};

const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+/g, '-');
};

const calculateDiscountPrice = (price, discount) => {
  return price - (price * discount) / 100;
};

module.exports = {
  generateOrderNumber,
  calculateCartTotal,
  formatPrice,
  generateSlug,
  calculateDiscountPrice,
};