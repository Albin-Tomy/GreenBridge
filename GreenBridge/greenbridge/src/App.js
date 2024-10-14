import React from 'react';
// import './App.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import RegLogin from './Pages/Authentication/RegLogin';
import Dashboard from './Pages/Dashboard/Admin/AdminDashboard';
import Home from './Pages/Home/Home';
import LandingPage from './Pages/Home/LandingPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import PendingRequestsPage from './Pages/Dashboard/Admin/PendingRequestPage';
import AllSHGsPage from './Pages/Dashboard/Admin/AllSHGSpage';
import ShgRegistration from './Pages/Dashboard/Shg/ShgRegistration';
import SHGDashboard from './Pages/Dashboard/Shg/ShgDashboard';
import ProductsPage from './Pages/Dashboard/Products/ProductsPage';
import Profile from './Pages/Dashboard/User/Profile';
import ForgotPassword from './Pages/Authentication/ForgotPassword'; 
import ResetPassword from './Pages/Authentication/ResetPassword';
import Staff from './Pages/Dashboard/Shg/Staff';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ProductDetail from './Pages/Dashboard/Products/ProductDetail';
import Admin from './Pages/Dashboard/Admin/Admin';
import CartPage from './Pages/Dashboard/Products/CartPage';
import Wishlist from './Pages/Dashboard/Products/WishList';
import HomePage from './Pages/Home/HomePage';
import LandingPages from './Pages/Home/LandingPages';

function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/admin/home" element={<Dashboard />} />
        <Route path="/admin/admin" element={<Admin />} />
        <Route path="/admin/pending-requests" element={<PendingRequestsPage />} />
        <Route path="/admin/view-all-shgs" element={<AllSHGsPage />} />
        <Route path='/shgregister' element={<ShgRegistration />} />
        <Route path="/login" element={<RegLogin />} />
        <Route path="/signup" element={<RegLogin />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path='/' element={<Home/>} />
        <Route path='/shg' element={<Staff/>}/>
        <Route path='/products' element={<ProductsPage/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset-confirm/:uidb64/:token" element={<ResetPassword />} />
        <Route path='/staff' element={<Staff/>}/>
        <Route path="/products/:id" element={<ProductDetail/>} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/landing" element={<LandingPages />} />
        <Route path="/homepage" element={<HomePage />} />
        
      </Routes>
    </Router>
  );
}

export default App;
