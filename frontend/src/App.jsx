import { Route, BrowserRouter, Routes } from 'react-router-dom';
import './App.css'
import ProductListingPage from './components/product/ProductListingPage';
import HomePage from './components/home/Home';
import Header from './components/Header';
import Cart from './components/cart/Cart';
import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import LogIn from './components/auth/LogIn';
import PrivateRoute from "./components/PrivateRoute";
import Register from './components/auth/Register';
import Checkout from './components/checkout/Checkout';
import PaymentConfirmation from './components/payment/PaymentConfirmation';
import Orders from './components/orders/Orders';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from './reduxStore/actions/categoryActions';
import { initializeAuth, logOutUser } from './reduxStore/actions/authActions';
import { syncCartFromBackend } from './reduxStore/actions/cartActions';
import Profile from './components/user/Profile';
import { SubHeaderProvider } from './components/shared/SubHeaderContext';
import SubHeaderSlot from './components/shared/SubHeaderSlot';
import ProductDetailsPage from './components/product/ProductDetailsPage';
import CashfreePayment from './components/payment/CashfreePayment';
import SellerDashboard from './components/seller/SellerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import { isTokenExpired } from './utils/tokenManager';
import ProfileEdit from './components/user/ProfileEdit';
import Addresses from './components/user/Addresses';
import EmailVerificationPending from './components/auth/EmailVerificationPending';
import VerifyEmail from './components/auth/VerifyEmail';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import AccountDeactivated from './components/auth/AccountDeactivated';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (user && user.token) {
      if (isTokenExpired(user.tokenExpirationTime)) {
        console.warn("Token expired, logging out");
        toast.error("Your session has expired. Please log in again.");
        dispatch(logOutUser());
      }
    }
  }, [user, dispatch]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(syncCartFromBackend());
  }, [dispatch]);


  return (
    <React.Fragment>
      <BrowserRouter>
        <SubHeaderProvider>
          <Header />
          <SubHeaderSlot />
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/products' element={<ProductListingPage />} />
            <Route path='/products/:productId' element={<ProductDetailsPage />} />
            <Route path='/cart' element={<Cart />} />

            <Route path='/' element={<PrivateRoute publicPage />}>
              <Route path='/login' element={<LogIn />} />
              <Route path='/register' element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email-pending" element={<EmailVerificationPending />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/account-deactivated" element={<AccountDeactivated />} />
            </Route>

            <Route path='/' element={<PrivateRoute />}>
              <Route path='/profile' element={<Profile />} />
              <Route path="/edit-profile" element={<ProfileEdit />} />
              <Route path="/addresses" element={<Addresses />} />
              <Route path='/checkout' element={<Checkout />}>
                <Route path="cashfree-payment" element={<CashfreePayment />} />
                <Route path="payment-confirmation" element={<PaymentConfirmation />} />
              </Route>
              <Route path='/payment-confirmation' element={<PaymentConfirmation />} />
              <Route path='/orders' element={<Orders />} />
            </Route>

            <Route path='/' element={<PrivateRoute roles={["ROLE_ADMIN"]} />}>
              <Route path='/admin/dashboard' element={<AdminDashboard />} />
            </Route>

            <Route path='/' element={<PrivateRoute roles={["ROLE_SELLER", "ROLE_ADMIN"]} />}>
              <Route path='/seller/dashboard' element={<SellerDashboard />} />
            </Route>
          </Routes>

        </SubHeaderProvider>
      </BrowserRouter>
      <Toaster position='bottom-center' />
    </React.Fragment>
  );
}

export default App;