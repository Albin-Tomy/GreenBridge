import React from 'react';
// import './App.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import RegLogin from './Pages/Authentication/RegLogin';
import Dashboard from './Pages/Dashboard/Admin/AdminDashboard';
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
import ProductDetail from './Pages/Dashboard/Products/ProductDetail';
import Admin from './Pages/Dashboard/Admin/Admin';
import CartPage from './Pages/Dashboard/Products/CartPage';
import Wishlist from './Pages/Dashboard/Products/WishList';
import HomePage from './Pages/Home/HomePage';
import LandingPages from './Pages/Home/LandingPages';
import DashboardLayout from './Pages/Dashboard/User/DashBoard';
// import ShgAdmin from './Pages/Dashboard/Shg/ShgAdmin';
// import Products from './Pages/Dashboard/Shg/Products';
// import Orders from './Pages/Dashboard/Shg/Orders';
import AddressSelection from './Pages/Dashboard/Products/AddressSelection';
import WasteCollectionRequest from './Pages/Dashboard/User/WasteCollectonRequest';
import WasteCategory from './Pages/Dashboard/User/WasteCategory';
import WasteSubcategory from './Pages/Dashboard/User/WasteSubCategory';
import LocationForm from './Pages/Dashboard/User/LocationForm';
import SHGRequests from './Pages/Dashboard/Shg/ShgRequest';
// import AdminDash from './Pages/Dashboard/Admin/AdminDash';
import Payment from './Pages/Dashboard/Products/PaymentPage';
import StaffOrders from './Pages/Dashboard/Shg/StaffOrders';
import AllSh from './Pages/Dashboard/Admin/AllSh';
import PendingShg from './Pages/Dashboard/Admin/PendingShg';
import Shgwaste from './Pages/Dashboard/Shg/ShgWaste';

import UserOrders from './Pages/Dashboard/Products/UserOrders';
import Sidebar from './components/SideBar';
import UserRequestView from './Pages/Dashboard/User/UserRequest';
import ProtectedRoute from './Pages/Authentication/ProtectedRoute';
import ShgProtectedRoute from './Pages/Authentication/ShgprotectedRoute';
import AdminProtectedRoute from './Pages/Authentication/AdminProtectedRoute';
import AdminOrder from './Pages/Dashboard/Admin/AdminOrder';
import NgoRegistration from './Pages/Dashboard/NGO/NgoRegistration';
import PendingNgo from './Pages/Dashboard/Admin/PendingNGO';
import AllNgo from './Pages/Dashboard/Admin/AllNGOsPage';
import VolunteerRegistration from './Pages/Dashboard/Volunteer/VolunteerRegistration';
import VolunteerProfile from './Pages/Dashboard/Volunteer/VolunteerProfile';
import BlockchainExplorer from './Pages/Dashboard/Volunteer/BlockchainExplorer';
import CommonRequestForm from './Pages/Dashboard/User/CommonRequestForm';
import FoodRequestForm from './Pages/Dashboard/User/FoodRequestForm';
import FoodRequestsView from './Pages/Dashboard/NGO/FoodRequestsView';

function App() {
  return (
    
    <Router>
      <Routes>
      

        <Route path="/admin/ngo" element={<AdminProtectedRoute element={<PendingNgo />} />} />
        <Route path="/volunteer/profile" element={<VolunteerProfile />} />
        <Route path="/admin/allngo" element={<AdminProtectedRoute element={<AllNgo />} />} />
        <Route path="/admin/order" element={<AdminProtectedRoute element={<AdminOrder />} />}/>
        <Route path="/admin/home" element={<AdminProtectedRoute element={<Dashboard />} />}/>
        <Route path="admin/view-all-shgs" element={<AdminProtectedRoute element={<AllSHGsPage />}/>} />
        <Route path="admin/pending-requests" element={< AdminProtectedRoute element={<PendingRequestsPage />}/>} />
    
        <Route path="/admin/admin" element={ < AdminProtectedRoute element={<Admin />}/>} />
        <Route path="/admin/pending-requests" element={< AdminProtectedRoute element={<PendingRequestsPage />}/>} />
        <Route path="/admin/view-all-shgs" element={<AllSHGsPage />} />
        <Route path='/shgregister' element={<ShgRegistration />} />
        <Route path="/login" element={<RegLogin />} />
        <Route path="/signup" element={<RegLogin />} />
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/" element={<Home />} /> */}
        <Route path='/shg' element={< ShgProtectedRoute element={<Staff/>}/>}/>
        <Route path='/products' element={<ProductsPage/>}/>
        <Route path="/address-list" element={<AddressSelection />} />
        <Route path="/request" element={<WasteCollectionRequest />} />
        <Route path="/category" element={< ShgProtectedRoute element={<WasteCategory />}/>} />
        <Route path="/subcategory" element={< ShgProtectedRoute element={<WasteSubcategory />}/>} />
        <Route path="/location" element={< ShgProtectedRoute element={<LocationForm />}/>} />
        <Route path="/shgrequest" element={<SHGRequests />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset-confirm/:uidb64/:token" element={<ResetPassword />} />
        <Route path='/staff' element={< ShgProtectedRoute element={<Staff/>}/>}/>
        <Route path="/products/:id" element={<ProductDetail/>} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        {/* <Route path="/admindash" element={<AdminDash />} /> */}
        <Route path="/stafforder" element={< ShgProtectedRoute element={<StaffOrders />}/>} />

        <Route path="/shgwaste" element={< ShgProtectedRoute element={<Shgwaste />}/>} />
        
        <Route path="/userorder" element={<UserOrders />} />

        <Route path="/sidebar" element={<Sidebar />} />

        <Route path="/userview" element={<UserRequestView />} />
        <Route path="/ngoregister" element={<NgoRegistration />} />

        <Route path="/allsh" element={<AllSh />} />
        <Route path="/pendingshg" element={<PendingShg />} />

        <Route path="/payment" element={<Payment />} />
        <Route path="/landing" element={<LandingPages />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path='profile' element={<Profile/>}/>
        </Route>

        <Route path="/volunteer-registration" element={<VolunteerRegistration />} />

        <Route path="/volunteer/blockchain" element={<BlockchainExplorer />} />

        <Route path="/service-request" element={<CommonRequestForm />} />
        <Route path="/food-request" element={<FoodRequestForm />} />

        <Route path="/ngo/food-requests" element={<FoodRequestsView />} />

      </Routes>
    </Router>
  );
}

export default App;
