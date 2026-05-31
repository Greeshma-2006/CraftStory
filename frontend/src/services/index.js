import api from './api';

// =========================
// AUTH
// =========================

export const authService = {

  register: (data) =>
    api.post('/api/auth/register', data),

  login: (data) =>
    api.post('/api/auth/login', data),

  getMe: () =>
    api.get('/api/auth/me'),

  updateProfile: (data) =>
    api.put('/api/auth/profile', data),

  deleteAccount: () =>
    api.delete('/api/auth/account'),

  forgotPassword: (data) =>
    api.post('/api/auth/forgot-password', data),

  resetPassword: (token, data) =>
    api.put(`/api/auth/reset-password/${token}`, data),

  verifyAdminLogin: (token) =>
    api.get(`/api/auth/admin/verify-login/${token}`),
};

// =========================
// ARTISAN
// =========================

export const artisanService = {

  createProfile: (data) =>
    api.post('/api/artisans/profile', data),

  getMyProfile: () =>
    api.get('/api/artisans/profile/me'),

  updateProfile: (data) =>
    api.put('/api/artisans/profile', data),

  resubmitProfile: () =>
    api.put('/api/artisans/resubmit'),

  getApprovedArtisans: () =>
    api.get('/api/artisans/approved'),

  getApprovedArtisan: (id) =>
    api.get(`/api/artisans/approved/${id}`),
};

// =========================
// PRODUCTS
// =========================

export const productService = {

  getProductsByArtisan: (artisanId) =>
    api.get(`/api/products/artisan/${artisanId}`),

  getAll: (params) =>
    api.get('/api/products', { params }),

  getOne: (id) =>
    api.get(`/api/products/${id}`),

  create: (data) =>
    api.post('/api/products', data),

  update: (id, data) =>
    api.put(`/api/products/${id}`, data),

  delete: (id) =>
    api.delete(`/api/products/${id}`),

  getArtisanProducts: () =>
    api.get('/api/products/my/products'),
};

// =========================
// CART
// =========================

export const cartService = {

  get: () =>
    api.get('/api/cart'),

  add: (data) =>
    api.post('/api/cart/add', data),

  update: (data) =>
    api.put('/api/cart/update', data),

  remove: (productId) =>
    api.delete(`/api/cart/${productId}`),

  clear: () =>
    api.delete('/api/cart'),
};

// =========================
// WISHLIST
// =========================

export const wishlistService = {

  get: () =>
    api.get('/api/wishlist'),

  add: (data) =>
    api.post('/api/wishlist/add', data),

  remove: (productId) =>
    api.delete(`/api/wishlist/${productId}`),

  clear: () =>
    api.delete('/api/wishlist'),
};

// =========================
// ORDERS
// =========================

export const orderService = {

  create: (data) =>
    api.post('/api/orders', data),

  getCustomerOrders: () =>
    api.get('/api/orders/customer'),

  getArtisanOrders: () =>
    api.get('/api/orders/artisan'),

  updateOrderStatus: (orderId, data) =>
    api.put(`/api/orders/${orderId}/status`, data),

  markOrderReceived: (orderId) =>
    api.put(`/api/orders/${orderId}/received`, {}),
};

// =========================
// PAYMENT
// =========================

export const paymentService = {

  createRazorpayOrder: (data) =>
    api.post('/api/payment/create-order', data),

  verifyPayment: (data) =>
    api.post('/api/payment/verify', data),

  getRazorpayKey: () =>
    api.get('/api/payment/razorpay-key'),
};

// =========================
// ADMIN
// =========================

export const adminService = {

  getReports: () =>
    api.get('/api/reports'),

  updateReportStatus: (reportId, data) =>
    api.put(`/api/reports/${reportId}`, data),

  getDashboardStats: () =>
    api.get('/api/admin/dashboard'),

  getPendingRequests: () =>
    api.get('/api/admin/artisans/pending'),

  getApprovedArtisans: () =>
    api.get('/api/admin/artisans/approved'),

  getRejectedArtisans: () =>
    api.get('/api/admin/artisans/rejected'),

  getRevokedArtisans: () =>
    api.get('/api/admin/artisans/revoked'),

  approveArtisan: (id) =>
    api.put(`/api/admin/artisans/${id}/approve`),

  rejectArtisan: (id, data) =>
    api.put(`/api/admin/artisans/${id}/reject`, data),

  revokeArtisan: (id, data) =>
    api.put(`/api/admin/artisans/${id}/revoke`, data),
};

// =========================
// UPLOAD
// =========================

export const uploadService = {

  uploadImage: (formData) =>
    api.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getSignature: (params) =>
    api.get('/api/upload/signature', { params }),

  deleteImage: (data) =>
    api.post('/api/upload/delete', data),
};

// =========================
// REVIEWS
// =========================

export const reviewService = {

  getReviews: (productId) =>
    api.get(`/api/reviews/${productId}`),

  addReview: (productId, data) =>
    api.post(`/api/reviews/${productId}`, data),
};

// =========================
// REPORTS
// =========================

export const reportService = {

  createReport: (data) =>
    api.post('/api/reports', data),

  getMyReports: () =>
    api.get('/api/reports/my'),
};