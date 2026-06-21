# Mercato - E-Commerce Platform

A modern, full-featured e-commerce platform built with React and Vite. Mercato provides a seamless shopping experience with secure payment processing, user management, and comprehensive admin/seller dashboards.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Configuration](#configuration)
- [API Integration](#api-integration)
- [Core Modules](#core-modules)
- [State Management](#state-management)
- [Components Architecture](#components-architecture)
- [Authentication](#authentication)
- [Payment Integration](#payment-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

Mercato is a comprehensive e-commerce solution designed for buyers, sellers, and administrators. The platform supports product discovery, secure checkout, order management, and role-based dashboards for different user types.

## ✨ Features

### Customer Features
- **Product Discovery**: Browse, search, and filter products by categories
- **Product Details**: Detailed product information with image galleries and reviews
- **Shopping Cart**: Add/remove items, manage quantities, persistent cart storage
- **Checkout Process**: Multi-step checkout with address selection and payment
- **Address Management**: Add, edit, view, and delete multiple delivery addresses
- **Order Tracking**: View order history and detailed order information
- **User Profile**: Manage personal information and account settings
- **Email Verification**: Secure account verification process
- **Account Management**: Profile editing and account deactivation options
- **Payment Options**: Secure payment integration with Cashfree

### Seller Features (My Store)
- **Seller Dashboard**: Overview of sales and performance metrics
- **My Store Management**: Complete control over store information and branding
- **Product Management**: Add, edit, and manage product listings
- **Inventory Tracking**: Monitor stock levels and availability
- **Order Management**: Track and manage customer orders in real-time
- **Fulfillment Management**: Update order fulfillment status and shipping
- **Sales Analytics**: View sales performance and metrics
- **Store Customization**: Customize store appearance and details

### Admin Features (Admin Panel)
- **Admin Dashboard**: System overview and key metrics
- **User Management**: Monitor, manage, and view all user accounts
  - User roles and permissions
  - Account status monitoring
  - User activity tracking
- **Product Management**: Control product catalog and listings
  - Product approval and verification
  - Bulk operations
  - Product categorization
- **Category Management**: Organize and manage product categories
  - Create and update categories
  - Category hierarchy management
- **Order Monitoring**: Track and manage all platform orders
  - Order status tracking
  - Order fulfillment oversight
  - Dispute resolution
- **Cart Analytics**: Monitor shopping cart activities and abandoned carts
- **Seller Management**: Oversee seller activities and performance
  - Seller accounts and verification
  - Store status monitoring
  - Performance metrics

## 🛠 Tech Stack

### Frontend
- **React 19.2.0**: Modern React with hooks and concurrent features
- **Vite 7.2.4**: Ultra-fast build tool and dev server
- **React Router DOM 7.13.0**: Client-side routing and navigation
- **Redux Toolkit 2.11.2**: Predictable state management
- **Redux Persist 6.0.0**: Local storage persistence for Redux state
- **Tailwind CSS 4.1.18**: Utility-first CSS framework
- **Material-UI 7.3.7**: Comprehensive component library

### UI Components & Icons
- **Headless UI 2.2.9**: Unstyled, accessible components
- **React Icons 5.5.0**: Popular icon libraries
- **Swiper 12.1.0**: Touch-enabled slider library
- **React Loader Spinner 8.0.2**: Loading state visualizations
- **React Hot Toast 2.6.0**: Toast notifications

### Forms & Validation
- **React Hook Form 7.71.1**: Performant form management
- **Validation Rules Utility**: Custom form validation logic

### Payment Processing
- **Cashfree Payments 1.0.6**: Indian payment gateway integration


### HTTP Client
- **Axios 1.13.4**: Promise-based HTTP client for API requests

### Styling
- **Emotion React 11.14.0**: CSS-in-JS styling library
- **Emotion Styled 11.14.1**: Styled components for Emotion

## 📁 Project Structure

```
mercato/
├── public/
│   └── _redirects              # Routing configuration for deployment
├── src/
│   ├── assets/                 # Static assets
│   │   └── sliders/           # Slider images and media
│   ├── backend/
│   │   └── api.js             # API integration and endpoints
│   ├── components/            # Reusable React components
│   │   ├── Header.jsx         # Main navigation header
│   │   ├── PrivateRoute.jsx   # Route protection component
│   │   ├── address/           # Address management components
│   │   │   ├── AddAddressForm.jsx
│   │   │   ├── AddressInfoModal.jsx
│   │   │   ├── AddressList.jsx
│   │   │   └── DeleteModal.jsx
│   │   ├── admin/             # Admin dashboard components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminOverviewTab.jsx
│   │   │   ├── CartsTab.jsx
│   │   │   ├── CategoriesTab.jsx
│   │   │   ├── OrdersTab.jsx
│   │   │   └── UsersTab.jsx
│   │   ├── auth/              # Authentication components
│   │   │   ├── AccountDeactivated.jsx
│   │   │   ├── EmailVerificationPending.jsx
│   │   │   ├── LogIn.jsx
│   │   │   ├── Register.jsx
│   │   │   └── VerifyEmail.jsx
│   │   ├── cart/              # Shopping cart components
│   │   │   ├── Cart.jsx
│   │   │   ├── CartItem.jsx
│   │   │   └── EmptyCart.jsx
│   │   ├── checkout/          # Multi-step checkout flow
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderSummary.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── steps/
│   │   │       ├── AddressStep.jsx
│   │   │       ├── PaymentStep.jsx
│   │   │       └── ReviewStep.jsx
│   │   ├── home/              # Homepage
│   │   │   ├── Home.jsx
│   │   │   └── HomeData.js
│   │   ├── orders/            # Order management
│   │   │   ├── OrderDetails.jsx
│   │   │   └── Orders.jsx
│   │   ├── payment/           # Payment processing
│   │   │   ├── CashfreePayment.jsx
│   │   │   └── PaymentConfirmation.jsx
│   │   ├── product/           # Product-related components
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── ImageGallery.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductDetailsPage.jsx
│   │   │   └── ProductListingPage.jsx
│   │   ├── seller/            # Seller dashboard components
│   │   │   ├── FulfillmentTab.jsx
│   │   │   ├── SellerDashboard.jsx
│   │   │   └── SellerOverviewTab.jsx
│   │   ├── shared/            # Shared utility components
│   │   │   ├── AddToCartControl.jsx
│   │   │   ├── DashboardWidgets.jsx
│   │   │   ├── ProductImageUpload.jsx
│   │   │   ├── ProductsTab.jsx
│   │   │   ├── QuantityStepper.jsx
│   │   │   ├── SubHeaderContext.jsx
│   │   │   ├── SubHeaderSlot.jsx
│   │   │   └── SupplyUpdateModal.jsx
│   │   └── user/              # User profile components
│   │       ├── Addresses.jsx
│   │       ├── Profile.jsx
│   │       └── ProfileEdit.jsx
│   ├── reduxStore/            # Redux state management
│   │   ├── actions/           # Redux action creators
│   │   │   ├── addressActions.js
│   │   │   ├── authActions.js
│   │   │   ├── cartActions.js
│   │   │   ├── categoryActions.js
│   │   │   ├── orderActions.js
│   │   │   ├── paymentActions.js
│   │   │   ├── productActions.js
│   │   │   └── sellerActions.js
│   │   ├── reducers/          # Redux reducer functions
│   │   │   ├── authReducer.js
│   │   │   ├── cartReducer.js
│   │   │   ├── categoryReducer.js
│   │   │   ├── productReducer.js
│   │   │   ├── sellerReducer.js
│   │   │   ├── statusReducer.js
│   │   │   └── store.js       # Redux store configuration
│   │   └── selectors/         # Redux selectors
│   │       └── cartSelectors.js
│   ├── utils/                 # Utility functions and helpers
│   │   ├── formatCurrency.js  # Currency formatting
│   │   ├── formatDate.js      # Date formatting
│   │   ├── orderUtils.js      # Order-related utilities
│   │   ├── paymentUtils.js    # Payment-related utilities
│   │   ├── productUtils.js    # Product-related utilities
│   │   ├── toastUtils.js      # Toast notification utilities
│   │   ├── tokenManager.js    # JWT token management
│   │   └── validationRules.js # Form validation rules
│   ├── App.jsx                # Root application component
│   ├── App.css                # Global application styles
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global CSS styles
├── eslint.config.js           # ESLint configuration
├── vite.config.js             # Vite build configuration
├── package.json               # Project dependencies and scripts
├── package-lock.json          # Locked dependency versions
└── index.html                 # HTML entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16.0.0 or higher
- npm or yarn package manager
- Backend API running on `http://localhost:6099`

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd mercato
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory with necessary environment variables:
```env
VITE_API_BASE_URL=http://localhost:6099
VITE_CASHFREE_KEY=your_cashfree_key
```

## 📦 Available Scripts

### Development
```bash
npm run dev
```
Starts the development server with hot module replacement (HMR) at `http://localhost:5173`

### Production Build
```bash
npm run build
```
Creates an optimized production build in the `dist/` directory

### Preview Build
```bash
npm run preview
```
Previews the production build locally

### Linting
```bash
npm run lint
```
Runs ESLint to check code quality and style compliance

## ⚙️ Configuration

### Vite Configuration ([vite.config.js](vite.config.js))
- **React Plugin**: Uses `@vitejs/plugin-react` for fast refresh
- **Tailwind CSS**: Integrated via `@tailwindcss/vite`
- **API Proxy**: Routes `/api` requests to `http://localhost:6099`

### ESLint Configuration ([eslint.config.js](eslint.config.js))
- JavaScript linting with recommended rules
- React plugin for component-specific checks
- React Hooks plugin for hook compliance validation

## 🔌 API Integration

### Backend Connection
- **Base URL**: `http://localhost:6099` (configured in [vite.config.js](vite.config.js))
- **HTTP Client**: Axios with interceptors for authentication
- **API Module**: [src/backend/api.js](src/backend/api.js)

### Key API Endpoints
- Authentication: `/api/auth/*`
- Products: `/api/products/*`
- Cart: `/api/cart/*`
- Orders: `/api/orders/*`
- Addresses: `/api/addresses/*`
- Users: `/api/users/*`
- Admin: `/api/admin/*`
- Seller: `/api/seller/*`

## 🎮 Core Modules

### Authentication Module
- User registration and login
- Email verification
- Token management with expiration checking
- Secure token storage and refresh
- Account deactivation
- Session management

### Product Catalog
- Product listing with pagination
- Advanced filtering and search
- Product categories
- Image galleries
- Product details and specifications
- Inventory management

### Shopping Cart
- Add/remove products
- Update quantities
- Persistent cart storage using Redux Persist
- Cart sync with backend
- Price calculations

### Checkout & Payment
- Single-step checkout process (Address → Review → Payment)
- Address selection/management
- Order summary review
- Secure online payment via Cashfree gateway
- Payment confirmation and instant order placement

### Order Management
- Order history and tracking
- Order details view
- Order status updates
- Seller fulfillment tracking

### User Management Module
- User registration with email verification
- Profile creation and management
- Multiple address storage for checkout
- Account preferences and settings
- Profile image upload and management
- Account deactivation and deletion
- User role assignment (Customer, Seller, Admin)
- Session management and token handling
- User activity tracking

### Admin Panel
The admin panel provides comprehensive control over the entire e-commerce platform:
- **Dashboard Overview**: Real-time metrics and key performance indicators
- **User Management Tab**: View and manage all users, roles, and permissions
- **Product Management Tab**: Approve products, manage listings, handle inventory
- **Category Management Tab**: Organize product categories and hierarchy
- **Orders Tab**: Monitor all orders, track fulfillment, and manage disputes
- **Carts Tab**: Analyze shopping cart data and abandoned carts
- **Seller Management**: Monitor seller stores, verify sellers, track performance
- **Analytics**: View sales trends, user statistics, and platform insights

Components: [AdminDashboard.jsx](src/components/admin/AdminDashboard.jsx), [AdminOverviewTab.jsx](src/components/admin/AdminOverviewTab.jsx), [UsersTab.jsx](src/components/admin/UsersTab.jsx), [ProductsTab.jsx](src/components/shared/ProductsTab.jsx), [CategoriesTab.jsx](src/components/admin/CategoriesTab.jsx), [OrdersTab.jsx](src/components/admin/OrdersTab.jsx), [CartsTab.jsx](src/components/admin/CartsTab.jsx)

### My Store (Seller Dashboard)
Sellers can manage their entire store through the seller dashboard:
- **Store Overview**: Dashboard with sales metrics and performance
- **Store Settings**: Manage store information, branding, and policies
- **Product Inventory**: Add, edit, and organize products
- **Order Fulfillment**: Manage incoming orders and fulfillment status
- **Sales Analytics**: Track sales, revenue, and performance trends
- **Customer Interactions**: Respond to customer inquiries and reviews

Components: [SellerDashboard.jsx](src/components/seller/SellerDashboard.jsx), [SellerOverviewTab.jsx](src/components/seller/SellerOverviewTab.jsx), [FulfillmentTab.jsx](src/components/seller/FulfillmentTab.jsx)

### User Profile Management
- **Profile Information**: View and edit personal details (name, email, phone)
- **Address Book**: Manage multiple delivery addresses
  - Add new addresses
  - Edit existing addresses
  - Set default address
  - Delete addresses
- **Profile Picture**: Upload and manage profile image
- **Account Settings**: Modify password, preferences, and notifications
- **Order History**: Quick access to past orders and reordering
- **Wishlist**: Save favorite products (if applicable)
- **Account Preferences**: Set communication and privacy preferences

Components: [Profile.jsx](src/components/user/Profile.jsx), [ProfileEdit.jsx](src/components/user/ProfileEdit.jsx), [Addresses.jsx](src/components/user/Addresses.jsx)

## 🏪 State Management

### Redux Store Architecture
Organized using Redux Toolkit with separate concerns:

**Actions** ([src/reduxStore/actions/](src/reduxStore/actions/))
- Async thunk actions for API calls
- Handles authentication, products, cart, orders, etc.
- Integrates with backend API

**Reducers** ([src/reduxStore/reducers/](src/reduxStore/reducers/))
- `authReducer.js`: User authentication state
- `cartReducer.js`: Shopping cart state
- `productReducer.js`: Product catalog state
- `categoryReducer.js`: Product categories state
- `sellerReducer.js`: Seller-specific state
- `statusReducer.js`: Loading and status states

**Selectors** ([src/reduxStore/selectors/](src/reduxStore/selectors/))
- Memoized selectors for derived state
- Cart-specific selectors for calculations

**Persistence**: Redux Persist automatically saves and restores state from localStorage

## 🏗️ Components Architecture

### Smart Components (Connected to Redux)
- [App.jsx](src/App.jsx): Root component with routing setup
- Dashboard components (Admin, Seller)
- Page components (Cart, Checkout, Orders)

### Presentational Components
- UI components (ProductCard, CartItem)
- Form components (LoginForm, AddressForm)
- Modal components (DeleteModal, SupplyUpdateModal)

### Layout Components
- [Header.jsx](src/components/Header.jsx): Navigation header with user menu
- [SubHeaderSlot.jsx](src/components/shared/SubHeaderSlot.jsx): Dynamic sub-header area
- Route-based layout switching

## 🔐 Authentication

### Authentication Flow
1. **Registration**: User creates account with email verification
2. **Email Verification**: Confirmation link sent to user email
3. **Login**: Credentials validated against backend
4. **Token Management**: JWT stored in Redux state and localStorage
5. **Token Expiration**: Automatic logout when token expires
6. **Session Sync**: Cart and data synced on successful login

### Protected Routes
- [PrivateRoute.jsx](src/components/PrivateRoute.jsx) wraps protected pages
- Redirects unauthenticated users to login
- Role-based access control for admin/seller dashboards

## 💳 Payment Integration

### Payment Processing
All payments are processed securely through **Cashfree**, which supports multiple payment methods including:
- Credit/Debit Cards
- Net Banking
- UPI
- Digital Wallets
- And more

### Payment Flow
1. User completes checkout (Address & Review steps)
2. Clicks "Proceed to Payment" button
3. Redirected to Cashfree secure gateway
4. User selects their preferred payment method
5. Payment processed by Cashfree
6. Order confirmation returned to platform
7. Email notification sent to customer

## 📈 Utilities

### Format Utilities
- **formatCurrency.js**: Format prices in local currency
- **formatDate.js**: Format dates consistently across app

### Business Logic Utilities
- **orderUtils.js**: Order processing and calculations
- **paymentUtils.js**: Payment-related logic
- **productUtils.js**: Product filtering and sorting
- **validationRules.js**: Form validation schemas

### Helper Utilities
- **tokenManager.js**: JWT token handling and expiration checks
- **toastUtils.js**: Toast notification helpers

## 🚢 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Netlify**: Configured with `_redirects` file for SPA routing
- **Vercel**: Supports Vite builds natively
- **Traditional Hosting**: Use `vite build` output

### Environment Variables
Set these in your hosting platform:
```
VITE_API_BASE_URL
VITE_CASHFREE_KEY
```

## 📝 Code Quality
### ESLint
Enforces code style and best practices:
```bash
npm run lint
```

### Pre-commit Checks
- Ensure no `console.log` statements in production code
- React best practices enforcement
- React Hooks dependency validation

## 🤝 Contributing

### Development Workflow
1. Create a feature branch
2. Make changes with proper component organization
3. Run linting: `npm run lint`
4. Test functionality in development mode
5. Create pull request with detailed description

### Code Style Guidelines
- Follow ESLint rules
- Use functional components with hooks
- Redux for global state, useState for local state
- Meaningful component and variable names
- Proper error handling and user feedback

### Commit Message Format
```
[Feature/Fix/Refactor] Brief description

Detailed explanation of changes
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [Redux Toolkit Docs](https://redux-toolkit.js.org)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [React Router Docs](https://reactrouter.com)

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For issues and support:
1. Check existing GitHub issues
2. Create detailed bug reports with reproduction steps
3. Contact the development team

---

**Last Updated**: April 2026
**Current Version**: 0.0.1
