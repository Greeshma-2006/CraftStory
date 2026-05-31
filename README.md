# CraftStory

A Heritage-Inspired Handcrafted Marketplace Connecting Artisans, Stories, and Customers.

## Overview

CraftStory is a full-stack artisan marketplace designed to empower local artisans by providing a platform where they can showcase their craftsmanship, share their personal journeys, and sell handmade products directly to customers.

Unlike traditional e-commerce platforms, CraftStory combines storytelling with commerce. Every approved artisan can publish their craft story, allowing customers to discover the cultural heritage, skills, and inspiration behind each handmade creation before making a purchase.

The platform follows a secure approval-based workflow where artisans must be verified by an administrator before they can sell products, ensuring authenticity and trust across the marketplace.

---

## Why CraftStory is Unique

Most e-commerce platforms focus only on products.

CraftStory focuses on both:

* The Product
* The Story Behind the Product

Key differentiators include:

* Artisan-first marketplace
* Public storytelling platform
* Approval-based artisan verification
* Dedicated admin moderation system
* Heritage-inspired user experience
* Transparent order tracking workflow
* Customer delivery confirmation system
* Integration of artisan journeys with product discovery

Customers do not simply buy products—they discover the people, traditions, and craftsmanship behind them.

---

## Features

### Public Access Features

Visitors can explore the platform without creating an account.

#### Expert Artisans

* View approved artisan profiles
* Learn about artisan expertise
* Discover artisan achievements

#### Craft Stories

* Read artisan journeys
* Explore cultural heritage stories
* Learn about traditional craftsmanship

#### Explore Crafts

* Discover handmade traditions
* Explore regional craft categories
* Understand artisan techniques

---

### Customer Features

#### Authentication

* User Registration
* User Login
* Secure JWT Authentication
* Protected User Routes

#### Shopping Experience

* Browse Products
* Search Products
* Filter Products
* Product Details Page
* Add to Cart
* Update Cart
* Remove from Cart
* Wishlist Management

#### Orders

* Place Orders
* Track Orders
* View Order History
* Delivery Confirmation

#### Payments

* Razorpay Integration
* Cash on Delivery (COD)
* Payment Verification
* Transaction Tracking

#### Reviews

* Product Ratings
* Product Reviews
* Verified Purchase Feedback

---

### Artisan Features

#### Registration Workflow

* Create Artisan Account
* Submit Artisan Profile
* Wait for Admin Approval

#### Approval-Based Access

Before approval:

* Cannot add products
* Cannot manage inventory
* Cannot publish products

After approval:

* Product management enabled
* Public artisan profile published
* Craft story published
* Marketplace access granted

#### Product Management

* Add Products
* Edit Products
* Delete Products
* Inventory Management
* Product Image Uploads
* Pricing Management

#### Order Management

* View Customer Orders
* Update Order Status
* Manage Shipments
* Track Sales Activity

---

### Admin Features

CraftStory includes a highly secure administrator workflow.

#### Secure Admin Authentication

* Separate admin access system
* Admin cannot use normal login/register pages
* Email verification required
* Protected admin routes
* Single administrator architecture

#### Platform Management

* Approve Artisan Applications
* Reject Artisan Applications
* Manage Users
* Manage Products
* Manage Orders
* Manage Reviews
* Manage Stories
* Remove Inappropriate Content
* Send Notifications
* Monitor Platform Activity

---

## Order Workflow

### Step 1

Customer places an order.

Status:

Pending

### Step 2

Artisan accepts the order.

Status:

Confirmed

### Step 3

Artisan prepares the product.

Status:

Processing

### Step 4

Artisan ships the product.

Status:

Shipped

### Step 5

Customer receives the product.

Customer clicks:

Mark as Received

### Step 6

System automatically updates:

Status:

Delivered

### Step 7

Customer can:

* Submit Rating
* Write Review
* Provide Feedback

---

## Payment Workflow

### Razorpay

* Secure Online Payment
* UPI Support
* Debit Cards
* Credit Cards
* Net Banking
* Wallet Support
* Payment Verification

### Cash on Delivery

* Order Placement without Online Payment
* Delivery Confirmation Workflow
* Payment Collection at Delivery

---

## Notification System

Notifications are generated for:

* Registration Events
* Approval Requests
* Approval Decisions
* Order Placement
* Payment Updates
* Shipping Updates
* Delivery Confirmation
* Review Activities
* Administrative Actions

---

## Security Features

* JWT Authentication
* Role-Based Access Control
* Protected Routes
* Email Verification
* Password Hashing
* Input Validation
* Secure API Access
* Admin Authorization Layer

---

## Technology Stack

### Frontend

* React.js
* Vite
* JavaScript
* Tailwind CSS
* React Router
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JWT (JSON Web Tokens)
* Bcrypt

### Payments

* Razorpay

### Media Storage

* Cloudinary

### Deployment

* Render
* Vercel (Optional)

---

## Project Structure

```bash
CraftStory/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── config/
│   └── package.json
│
├── README.md
└── .env
```

## Installation Guide

### Prerequisites

Install:

* Node.js
* MongoDB
* Git

---

### Clone Repository

```bash
git clone https://github.com/yourusername/craftstory.git
cd craftstory
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### Configure Environment Variables

Create a `.env` file inside backend:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key

RAZORPAY_SECRET=your_razorpay_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

---

### Run Backend

```bash
cd backend
npm run dev
```

### Run Frontend

```bash
cd frontend
npm run dev
```

---

### Access Application

Frontend:

```bash
http://localhost:5173
```

Backend:

```bash
http://localhost:5000
```

---

## Future Enhancements

* Real-Time Order Tracking
* AI-Based Product Recommendations
* Multi-Admin Support
* Artisan Analytics Dashboard
* Chat Between Customer and Artisan
* Mobile Application
* International Shipping Support
* Multi-Language Support

---

## Contributor

### Gudladona Greeshma

B.Tech Information Technology

Designer, Developer, Tester, and Maintainer of CraftStory.

---

## License

Copyright (c) 2026 Gudladona Greeshma

This project is developed for educational, academic, and portfolio purposes.

Unauthorized commercial distribution, modification, or resale of this project without permission from the author is prohibited.

All rights reserved.

---

## Acknowledgements

CraftStory was created with the vision of preserving traditional craftsmanship, empowering artisans, and connecting customers with authentic handmade products and the inspiring stories behind them.
